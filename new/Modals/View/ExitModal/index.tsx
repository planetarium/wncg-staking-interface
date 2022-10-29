import { memo, useRef } from 'react'
import { useUnmount } from 'react-use'
import { useMachine } from '@xstate/react'
import { useAtom } from 'jotai'
import { RESET } from 'jotai/utils'
import { useTransaction } from 'wagmi'

import { pendingExitTxAtom } from 'states/form'
import { configService } from 'services/config'
import { createLogger } from 'utils/log'
import { networkChainId } from 'utils/network'
import { bnum } from 'utils/num'
import { useFiatCurrency, usePool } from 'hooks'
import { currentPage, exitMachine } from './stateMachine'
import { useExitForm } from './useExitForm'

import Page1 from './Page1'
import Page2 from './Page2'
import Page3 from './Page3'

const log = createLogger('black')

function ExitModal() {
  const { toFiat } = useFiatCurrency()
  const { poolTokenAddresses } = usePool()

  const formReturns = useExitForm()

  const [pendingTx, setPendingTx] = useAtom(pendingExitTxAtom)
  const {
    amounts: pendingAmounts,
    assets: pendingAssets,
    bptIn: pendingBptIn,
    exactOut: pendingExactOut,
    exitType: pendingExitType,
    isProportional: pendingIsProportional,
    hash: pendingHash,
  } = pendingTx

  const assets = pendingAssets ?? formReturns.assets
  const bptIn = pendingBptIn ?? formReturns.bptIn
  const exactOut = pendingExactOut ?? formReturns.exactOut
  const exitAmounts = pendingAmounts ?? formReturns.exitAmounts
  const exitType = pendingExitType ?? formReturns.exitType
  const isProportional = pendingIsProportional ?? formReturns.isProportional
  const hash = pendingHash ?? undefined

  const stateMachine = useRef(exitMachine)
  const [state, send] = useMachine(stateMachine.current, {
    context: {
      hash,
    },
  })

  const exitAmountsInFiatValue =
    poolTokenAddresses
      .reduce((total, address, i) => {
        address =
          exitType === configService.nativeAssetAddress
            ? configService.nativeAssetAddress
            : address
        const delta = toFiat(address, bnum(exitAmounts[i]).toString())
        return total.plus(delta)
      }, bnum(0))
      .toFixed(2) || '0'

  useTransaction({
    hash: hash!,
    enabled: !!hash,
    chainId: networkChainId,
    onSettled() {
      log(`Exit tx: ${hash?.slice(0, 6)}`)
    },
    async onSuccess(response: TransactionResponse) {
      console.log('RESPONSE:', response)
      if (!response) return
      try {
        await response.wait()
        console.log('✅ SUCCESS from:', 0)
        send('SUCCESS')
      } catch (error) {
        console.log('🔥 FAIL from:', 0)
        send('FAIL')
      }
    },
  })

  const page = currentPage(state.value)

  useUnmount(() => {
    if (!!state.done) {
      setPendingTx(RESET)
    }
  })

  return (
    <>
      <Page1 {...formReturns} currentPage={page} send={send} />
      <Page2
        assets={assets}
        bptIn={bptIn}
        currentPage={page}
        exactOut={exactOut}
        exitAmounts={exitAmounts}
        exitType={exitType}
        isProportional={isProportional}
        fiatValue={exitAmountsInFiatValue}
        send={send}
        isPending={state.value === 'exitPending'}
      />
      <Page3 currentPage={page} />
    </>
  )
}

export default memo(ExitModal)
