import { useEffect, useMemo, useRef, useState } from 'react'
import { useUnmount } from 'react-use'
import { useMachine } from '@xstate/react'
import { useAtom } from 'jotai'
import { RESET } from 'jotai/utils'
import type { TransactionReceipt } from '@ethersproject/abstract-provider'
import { useWaitForTransaction } from 'wagmi'

import { pendingStakeTxAtom } from 'states/form'
import { createLogger } from 'utils/log'
import { networkChainId } from 'utils/network'
import { parseTransferLogs } from 'utils/tx'
import { useFiatCurrency, useStaking } from 'hooks'
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
  const [result, setResult] = useState('0')

  const { bptToFiat } = useFiatCurrency()
  const { stakedTokenAddress } = useStaking()

  const [pendingTx, setPendingTx] = useAtom(pendingStakeTxAtom)

  const { amount: pendingAmount, hash: pendingHash } = pendingTx

  const stakeAmount = pendingAmount ?? amount
  const stakeAmountInFiatValue = bptToFiat(stakeAmount)
  const hash = pendingHash ?? undefined

  const stateMachine = useRef(stakeMachine)
  const [state, send] = useMachine(stateMachine.current, {
    context: {
      hash,
      isApproved,
    },
  })
  const currentState = state.value as string

  useWaitForTransaction({
    hash: hash!,
    enabled: !!hash,
    chainId: networkChainId,
    onSettled() {
      log(`Stake tx: ${hash?.slice(0, 6)}`)
    },
    onSuccess(data: TransactionReceipt) {
      const result = parseTransferLogs(data.logs)
      setResult(result[stakedTokenAddress])
      send('SUCCESS')
    },
    onError() {
      send('FAIL')
    },
  })

  const page = useMemo(() => currentPage(state.value), [state.value])

  useEffect(() => {
    if (currentState === `approveSuccess`) {
      setPendingTx((prev) => ({
        ...prev,
        hash: undefined,
      }))
    }
  }, [currentState, setPendingTx])

  useUnmount(() => {
    if (!!state.done) {
      setPendingTx(RESET)
      resetForm()
    }
  })

  return (
    <>
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
      <Page4 currentPage={page} currentState={state.value} result={result} />
    </>
  )
}

export default StakeModal
