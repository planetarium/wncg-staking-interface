import { MouseEvent, useCallback, useEffect, useMemo } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useMachine } from '@xstate/react'

import { approvalState, poolTokenApprovalsState } from 'app/states/approval'
import { ModalCategory } from 'app/states/modal'
import { handleError } from 'utils/error'
import { bnum } from 'utils/num'
import {
  useApprove,
  useEventFilter,
  useJoinPool,
  useModal,
  useProvider,
} from 'hooks'
import { createInvestMachine } from './investMachine'

export function useInvestMachine(amounts: string[], isNativeAsset: boolean) {
  const { approveWeth, approveWncg } = useApprove()
  const {
    poolBalanceChangedEventFilter,
    wethApprovalEventFilter,
    wncgApprovalEventFilter,
  } = useEventFilter()
  const { joinPool } = useJoinPool()
  const { removeModal } = useModal()
  const provider = useProvider()

  const setApproval = useSetRecoilState(approvalState)
  const poolTokenApprovals = useRecoilValue(poolTokenApprovalsState)

  const investMachine = useMemo(
    () => createInvestMachine(amounts, poolTokenApprovals, isNativeAsset),
    [amounts, isNativeAsset, poolTokenApprovals]
  )

  const [state, send] = useMachine(investMachine)

  const handleSubmit = useCallback(
    async (e: MouseEvent) => {
      e.stopPropagation()

      try {
        switch (state.value) {
          case 'approveWncg':
            send('APPROVING_WNCG')
            await approveWncg()
            break
          case 'approveWeth':
            send('APPROVING_WETH')
            await approveWeth()
            break
          case 'invest':
            send('INVESTING')
            await joinPool(amounts, isNativeAsset)
            break
          default:
            removeModal(ModalCategory.InvestPreview)
            break
        }
      } catch (error) {
        send('ROLLBACK')
        handleError(error)
      }
    },
    [
      amounts,
      approveWeth,
      approveWncg,
      isNativeAsset,
      joinPool,
      removeModal,
      send,
      state.value,
    ]
  )

  const stepsToSkip = useMemo(
    () =>
      amounts.map((amount, i) => {
        if (i === 1 && isNativeAsset) return true
        if (!bnum(amount).isZero()) return false
        return true
      }),
    [amounts, isNativeAsset]
  )

  const handleWncgApprovalEvent = useCallback(() => {
    send('APPROVED_WNCG')
    setApproval((prev) => ({ ...prev, wncg: true }))
  }, [send, setApproval])

  useEffect(() => {
    if (wncgApprovalEventFilter) {
      provider?.on(wncgApprovalEventFilter, handleWncgApprovalEvent)
      return () => {
        provider?.off(wncgApprovalEventFilter)
      }
    }
  }, [handleWncgApprovalEvent, provider, wncgApprovalEventFilter])

  const handleWethApprovalEvent = useCallback(() => {
    send('APPROVED_WETH')
    setApproval((prev) => ({ ...prev, weth: true }))
  }, [send, setApproval])

  useEffect(() => {
    if (wethApprovalEventFilter) {
      provider?.on(wethApprovalEventFilter, handleWethApprovalEvent)
      return () => {
        provider?.off(wethApprovalEventFilter)
      }
    }
  }, [handleWethApprovalEvent, provider, wethApprovalEventFilter])

  const handlePoolBalanceChangedEvent = useCallback(() => {
    send('COMPLETED')
  }, [send])

  useEffect(() => {
    if (poolBalanceChangedEventFilter) {
      provider?.on(poolBalanceChangedEventFilter, handlePoolBalanceChangedEvent)
      return () => {
        provider?.off(poolBalanceChangedEventFilter)
      }
    }
  }, [handlePoolBalanceChangedEvent, poolBalanceChangedEventFilter, provider])

  return {
    handleSubmit,
    send,
    state,
    stepsToSkip,
  }
}
