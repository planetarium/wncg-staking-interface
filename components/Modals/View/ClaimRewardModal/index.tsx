import { memo, useMemo, useRef, useState } from 'react'
import { useUnmount } from 'react-use'
import { useMachine } from '@xstate/react'
import { useAtom } from 'jotai'
import { RESET } from 'jotai/utils'
import type { TransactionReceipt } from '@ethersproject/abstract-provider'
import { useWaitForTransaction } from 'wagmi'

import { pendingClaimTxAtom } from 'states/form'
import { createLogger } from 'utils/log'
import { networkChainId } from 'utils/network'
import { parseTransferLogs } from 'utils/tx'
import { claimMachine, currentPage } from './stateMachine'
import { useClaimForm } from './useClaimForm'

import Page1 from './Page1'
import Page2 from './Page2'

const log = createLogger('black')

function ClaimRewardModal() {
  const [result, setResult] = useState<Record<string, string>>({})

  const {
    register,
    tokensToClaim: _tokensToClaim,
    rewardsToClaim: _rewardsToClaim,
  } = useClaimForm()

  const [pendingTx, setPendingTx] = useAtom(pendingClaimTxAtom)
  const {
    rewardsToClaim: pendingRewardsToClaim,
    tokensToClaim: pendingTokensToClaim,
    hash: pendingHash,
  } = pendingTx

  const tokensToClaim = pendingTokensToClaim ?? _tokensToClaim
  const rewardsToClaim = pendingRewardsToClaim ?? _rewardsToClaim
  const hash = pendingHash ?? undefined

  const stateMachine = useRef(claimMachine)
  const [state, send] = useMachine(stateMachine.current, {
    context: {
      hash,
    },
  })

  useWaitForTransaction({
    hash: hash!,
    enabled: !!hash,
    chainId: networkChainId,
    onSettled() {
      log(`Claim tx: ${hash?.slice(0, 6)}`)
    },
    onSuccess(data: TransactionReceipt) {
      const result = parseTransferLogs(data.logs)
      setResult(result)
      send('SUCCESS')
    },
    onError() {
      send('FAIL')
    },
  })

  const page = useMemo(() => currentPage(state.value), [state.value])

  useUnmount(() => {
    if (!!state.done) {
      setPendingTx(RESET)
    }
  })

  return (
    <>
      <Page1
        currentPage={page}
        currentState={state.value}
        register={register}
        send={send}
        tokensToClaim={tokensToClaim}
        rewardsToClaim={rewardsToClaim}
      />
      <Page2 currentPage={page} result={result} />
    </>
  )
}

export default memo(ClaimRewardModal)
