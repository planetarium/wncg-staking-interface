import { memo, useEffect, useMemo } from 'react'
import { useRecoilValue } from 'recoil'

import { approvalState } from 'app/states/approval'
import { useAllowance, useApprove, useEventFilter, useProvider } from 'hooks'

function ApprovalEffects() {
  const {
    bptAllowanceToStakingContract,
    wethAllowanceToVaultContract,
    wncgAllowanceToVaultContract,
  } = useAllowance()
  const { createApprovalEventHandler } = useApprove()
  const {
    bptApprovalEventFilter,
    wethApprovalEventFilter,
    wncgApprovalEventFilter,
  } = useEventFilter()
  const provider = useProvider()

  const {
    bpt: isBptApproved,
    weth: isWethApproved,
    wncg: isWncgApproved,
  } = useRecoilValue(approvalState)

  const handleBptApprovalEvent = useMemo(
    () => createApprovalEventHandler('bpt'),
    [createApprovalEventHandler]
  )

  const handleWethApprovalEvent = useMemo(
    () => createApprovalEventHandler('weth'),
    [createApprovalEventHandler]
  )

  const handleWncgApprovalEvent = useMemo(
    () => createApprovalEventHandler('wncg'),
    [createApprovalEventHandler]
  )

  useEffect(() => {
    bptAllowanceToStakingContract()
  }, [bptAllowanceToStakingContract])

  useEffect(() => {
    wethAllowanceToVaultContract()
  }, [wethAllowanceToVaultContract])

  useEffect(() => {
    wncgAllowanceToVaultContract()
  }, [wncgAllowanceToVaultContract])

  useEffect(() => {
    if (!isBptApproved && bptApprovalEventFilter) {
      provider?.on(bptApprovalEventFilter, handleBptApprovalEvent)
      return () => {
        provider?.off(bptApprovalEventFilter)
      }
    }
  }, [bptApprovalEventFilter, handleBptApprovalEvent, isBptApproved, provider])

  useEffect(() => {
    if (!isWethApproved && wethApprovalEventFilter) {
      provider?.on(wethApprovalEventFilter, handleWethApprovalEvent)
      return () => {
        provider?.off(wethApprovalEventFilter)
      }
    }
  }, [
    handleWethApprovalEvent,
    isWethApproved,
    provider,
    wethApprovalEventFilter,
  ])

  useEffect(() => {
    if (!isWncgApproved && wncgApprovalEventFilter) {
      provider?.on(wncgApprovalEventFilter, handleWncgApprovalEvent)
      return () => {
        provider?.off(wncgApprovalEventFilter)
      }
    }
  }, [
    handleWncgApprovalEvent,
    isWncgApproved,
    provider,
    wncgApprovalEventFilter,
  ])

  return null
}

export default memo(ApprovalEffects)
