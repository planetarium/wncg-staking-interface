import { useEffect, useMemo, useRef } from 'react'
import { useUnmount } from 'react-use'
import { useMachine } from '@xstate/react'
import { useAtom } from 'jotai'
import { RESET } from 'jotai/utils'
import { useTransaction } from 'wagmi'

import {
  pendingJoinAmountsAtom,
  pendingJoinAssetsAtom,
  pendingJoinHashAtom,
} from 'states/form'
import { createLogger } from 'utils/log'
import { networkChainId } from 'utils/network'
import { bnum } from 'utils/num'
import { useFiatCurrency } from 'hooks'
import { currentPage, joinMachine } from './stateMachine'
import { extractTokenAddress } from './utils'

import Page1 from './Page1'
import Page2 from './Page2'
import Page3 from './Page3'
import Page4 from './Page4'

const log = createLogger('black')

type JoinModalProps = {
  amounts: string[]
  assets: string[]
  resetForm(): void
  tokensToApprove: string[]
}

function JoinModal({
  amounts,
  assets,
  resetForm,
  tokensToApprove,
}: JoinModalProps) {
  const { toFiat } = useFiatCurrency()
  const [hash, setHash] = useAtom(pendingJoinHashAtom)
  const [pendingJoinAmounts, setPendingJoinAmounts] = useAtom(
    pendingJoinAmountsAtom
  )
  const [pendingJoinAssets, setPendingJoinAssets] = useAtom(
    pendingJoinAssetsAtom
  )

  const stateMachine = useRef(joinMachine(tokensToApprove))
  const [state, send] = useMachine(stateMachine.current, {
    context: { hash },
  })

  useTransaction({
    hash: hash!,
    enabled: !!hash,
    chainId: networkChainId,
    onSettled() {
      log(`Join tx: ${hash?.slice(0, 6)}`)
    },
    async onSuccess(response: TransactionResponse) {
      console.log('RESPONSE:', response)
      try {
        await response?.wait()
        console.log('✅ SUCCESS from:', 0)
        send('SUCCESS')
      } catch (error) {
        console.log('🔥 FAIL from:', 0)
        console.log('Failed reason:', 0, error)
        send('FAIL')
      }
    },
  })

  const hasPendingTx =
    !!hash && !pendingJoinAmounts.every((amount) => bnum(amount).isZero())

  const joinAmounts = hasPendingTx ? pendingJoinAmounts : amounts
  const joinAssets = hasPendingTx ? pendingJoinAssets : assets

  const joinAmountsInFiatValue = joinAmounts
    .reduce((total, amount, i) => {
      return total.plus(toFiat(joinAssets[i], amount))
    }, bnum(0))
    .toNumber()

  const page = useMemo(() => currentPage(state.value), [state.value])
  const currentState = state.value as string
  const { approvals } = state.context

  // NOTE: Reset hash when join tx is fulfilled
  useEffect(() => {
    const _currentState = currentState.toLowerCase()
    if (_currentState.includes('success')) {
      setHash(RESET)
    }
  }, [currentState, setHash])

  useUnmount(() => {
    const _currentState = currentState.toLowerCase()

    if (!!state.done) {
      setHash(RESET)
      setPendingJoinAmounts(RESET)
      setPendingJoinAssets(RESET)
      resetForm()

      // if (_currentState.startsWith('join')) {
      //   setPendingJoinAmounts(RESET)
      //   setPendingJoinAssets(RESET)
      //   resetForm()
      // }
    }
  })

  return (
    <>
      {currentState.slice(0, 20)} /{' '}
      <span style={{ color: 'red' }}>{hash?.slice(0, 6) ?? typeof hash}</span>
      <br />
      {/* <span>{JSON.stringify(state.context.approvals)}</span> */}
      <span>{JSON.stringify(joinAmounts)}</span>
      {/* <br /> PAGE {page} / {joinAmounts} */}
      <Page1
        address={extractTokenAddress(currentState)}
        currentPage={page}
        send={send}
        isPending={currentState.startsWith('approvePending')}
      />
      <Page2
        address={extractTokenAddress(currentState)}
        approvals={approvals}
        currentPage={page}
        send={send}
      />
      <Page3
        amounts={joinAmounts}
        assets={joinAssets}
        currentPage={page}
        fiatValue={joinAmountsInFiatValue}
        send={send}
        isPending={currentState === 'joinPending'}
      />
      <Page4 currentPage={page} currentState={state.value} send={send} />
    </>
  )
}

export default JoinModal
