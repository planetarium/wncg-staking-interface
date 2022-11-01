import { useEffect, useMemo, useRef, useState } from 'react'
import { useUnmount } from 'react-use'
import { useMachine } from '@xstate/react'
import { useAtom } from 'jotai'
import { RESET } from 'jotai/utils'
import type { TransactionReceipt } from '@ethersproject/abstract-provider'
import { useWaitForTransaction } from 'wagmi'

import { pendingJoinTxAtom } from 'states/form'

import { parseLog } from 'utils/iface'
import { createLogger } from 'utils/log'
import { networkChainId } from 'utils/network'
import { bnum } from 'utils/num'
import { parseTransferLogs } from 'utils/tx'
import { useFiatCurrency } from 'hooks'
import { currentPage, joinMachine } from './stateMachine'

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
  const [result, setResult] = useState<Record<string, string>>({})

  const { toFiat } = useFiatCurrency()
  const [pendingTx, setPendingTx] = useAtom(pendingJoinTxAtom)
  const {
    amounts: pendingAmounts,
    assets: pendingAssets,
    tokensToApprove: pendingTokensToApprove,
    hash: pendingHash,
  } = pendingTx

  amounts = pendingAmounts ?? amounts
  assets = pendingAssets ?? assets
  tokensToApprove = pendingTokensToApprove ?? tokensToApprove

  const hash = pendingHash ?? undefined

  const stateMachine = useRef(joinMachine)
  const [state, send] = useMachine(stateMachine.current, {
    context: {
      amounts,
      assets,
      hash,
      tokensToApprove,
    },
  })
  const currentState = state.value as string

  useWaitForTransaction({
    hash: hash!,
    enabled: !!hash,
    chainId: networkChainId,
    onSettled() {
      log(`Join tx: ${hash?.slice(0, 6)}`)
    },
    onSuccess(data: TransactionReceipt) {
      const parsedLogs = data.logs.map((log) => parseLog(log))

      const isApprovalTx = parsedLogs.some((log) => log?.name === 'Approval')
      const isJoinPoolTx = parsedLogs.some(
        (log) => log?.name === 'PoolBalanceChanged'
      )

      if (isApprovalTx) {
        setPendingTx((prev) => {
          const newTokensToApprove = [...(prev.tokensToApprove ?? [])]
          newTokensToApprove.shift()

          return {
            ...prev,
            tokensToApprove: newTokensToApprove,
          }
        })
      }

      if (isJoinPoolTx) {
        setPendingTx(RESET)
        setResult(parseTransferLogs(data.logs))
      }

      send('SUCCESS')
    },
    onError() {
      send('FAIL')
      setPendingTx({
        hash: undefined,
      })
      stateMachine.current.transition(state.value, { type: 'ROLLBACK' })
    },
  })

  const joinAmountsInFiatValue = amounts
    .reduce((total, amount, i) => {
      return total.plus(toFiat(assets[i], amount))
    }, bnum(0))
    .toNumber()

  const page = useMemo(() => currentPage(state.value), [state.value])

  const tokenToApprove = state.context.tokensToApprove[0]

  // NOTE: Reset hash when join tx is fulfilled
  useEffect(() => {
    if (currentState === `approveSuccess`) {
      setPendingTx((prev) => ({
        ...prev,
        hash: undefined,
      }))
    }
  }, [currentState, setPendingTx])

  // NOTE: Reset everything when 1) tx failed 2) joined
  useUnmount(() => {
    if (!!state.done) {
      setPendingTx(RESET)
      resetForm()
    }
  })

  return (
    <>
      <Page1
        address={tokenToApprove}
        currentPage={page}
        send={send}
        tokensToApprove={tokensToApprove}
        isPending={currentState.startsWith('approvePending')}
      />
      <Page2
        address={tokenToApprove}
        approvals={state.context.tokensToApprove}
        currentPage={page}
        send={send}
      />
      <Page3
        amounts={amounts}
        assets={assets}
        currentPage={page}
        fiatValue={joinAmountsInFiatValue}
        send={send}
        isPending={currentState === 'joinPending'}
      />
      <Page4 currentPage={page} currentState={state.value} result={result} />
    </>
  )
}

export default JoinModal
