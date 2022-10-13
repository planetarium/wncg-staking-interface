import { useEffect, useMemo, useRef } from 'react'
import { useUnmount } from 'react-use'
import { useMachine } from '@xstate/react'
import { useAtom } from 'jotai'
import { RESET } from 'jotai/utils'
import { useTransaction } from 'wagmi'

import { pendingStakeAmountAtom, pendingStakeHashAtom } from 'states/form'
import { createLogger } from 'utils/log'
import { networkChainId } from 'utils/network'
import { bnum } from 'utils/num'
import { useFiatCurrency } from 'hooks'
import { currentPage, stakeMachine } from './stateMachine'

import Page1 from './Page1'
import Page2 from './Page2'
import Page3 from './Page3'
import Page4 from './Page4'

const log = createLogger('black')

type StakeModalProps = {
  amount: string
  isApproved: boolean
  resetForm(): void
}

function StakeModal({ amount, isApproved, resetForm }: StakeModalProps) {
  const { getBptFiatValue } = useFiatCurrency()
  const [hash, setHash] = useAtom(pendingStakeHashAtom)
  const [pendingStakeAmount, setPendingStakeAmount] = useAtom(
    pendingStakeAmountAtom
  )

  const stateMachine = useRef(stakeMachine)
  const [state, send] = useMachine(stateMachine.current, {
    context: {
      hash,
      isApproved,
    },
  })

  useTransaction({
    hash: hash!,
    enabled: !!hash,
    chainId: networkChainId,
    onSettled() {
      log(`Stake tx: ${hash?.slice(0, 6)}`)
    },
    async onSuccess(response: TransactionResponse) {
      try {
        await response.wait()
        send('SUCCESS')
      } catch (error) {
        send('FAIL')
      }
    },
  })

  const stakeAmount =
    !!hash && !bnum(pendingStakeAmount).isZero() ? pendingStakeAmount : amount
  const stakeAmountInFiatValue = getBptFiatValue(stakeAmount)

  const page = useMemo(() => currentPage(state.value), [state.value])

  // NOTE: Reset hash when approve tx is fulfilled
  useEffect(() => {
    if (['approveSuccess', 'approveFail'].includes(state.value as string))
      setHash(RESET)
  }, [setHash, state.value])

  useUnmount(() => {
    if (!!state.done) {
      setHash(RESET)

      if ((state.value as string).startsWith('stake')) {
        setPendingStakeAmount(RESET)
        resetForm()
      }
    }
  })

  return (
    <>
      {state.value}/{hash}/{stakeAmount}
      <Page1
        currentPage={page}
        send={send}
        isPending={state.value === 'approvePending'}
      />
      <Page2 currentPage={page} send={send} />
      <Page3
        amount={stakeAmount}
        currentPage={page}
        fiatValue={stakeAmountInFiatValue}
        send={send}
        isPending={state.value === 'stakePending'}
      />
      <Page4
        amount={stakeAmount}
        currentPage={page}
        currentState={state.value}
        fiatValue={stakeAmountInFiatValue}
      />
    </>
  )
}

export default StakeModal
