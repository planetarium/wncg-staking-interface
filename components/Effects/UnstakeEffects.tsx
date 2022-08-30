import { memo, useCallback, useEffect } from 'react'
import { Event } from 'ethers'

import {
  useBalances,
  useEventFilters,
  useProvider,
  useRewards,
  useStakedBalance,
  useStaking,
  useTransaction,
  useUnstakeTimestamps,
} from 'hooks'
import { TransactionAction } from 'services/transaction'

function UnstakeEffects() {
  const { fetchBalances } = useBalances()
  const { cooldownEventFilter, withdrawnEventFilter } = useEventFilters()
  const provider = useProvider()
  const { fetchStakedBalance } = useStakedBalance()
  const { fetchRewards } = useRewards()
  const { fetchTotalStaked } = useStaking()
  const { updateTxStatus } = useTransaction()
  const { fetchTimestamps } = useUnstakeTimestamps()

  const handleCooldownEvent = useCallback(
    async (event: Event) => {
      await updateTxStatus?.(event, TransactionAction.StartCooldown, {
        onFulfill: () => {
          fetchTimestamps()
        },
      })
    },
    [fetchTimestamps, updateTxStatus]
  )

  const handleWithdrawnEvent = useCallback(
    async (event: Event) => {
      await updateTxStatus?.(event, TransactionAction.Withdraw, {
        onFulfill: () => {
          fetchStakedBalance()
          fetchBalances()
          fetchTotalStaked()
        },
      })
    },
    [fetchBalances, fetchStakedBalance, fetchTotalStaked, updateTxStatus]
  )

  const handleWithdrawnAndAllRewardsEvent = useCallback(
    async (event: Event) => {
      await updateTxStatus?.(event, TransactionAction.WithdrawAndClaim, {
        onFulfill: () => {
          fetchRewards()
          fetchBalances()
          fetchStakedBalance()
          fetchTotalStaked()
        },
      })
    },
    [
      fetchBalances,
      fetchRewards,
      fetchTotalStaked,
      fetchStakedBalance,
      updateTxStatus,
    ]
  )

  // NOTE: Cooldown event
  useEffect(() => {
    if (cooldownEventFilter) {
      provider?.on(cooldownEventFilter, handleCooldownEvent)
      return () => {
        provider?.off(cooldownEventFilter)
      }
    }
  }, [cooldownEventFilter, handleCooldownEvent, provider])

  // NOTE: Withdrawn event
  useEffect(() => {
    if (withdrawnEventFilter) {
      provider?.on(withdrawnEventFilter, handleWithdrawnEvent)
      provider?.on(withdrawnEventFilter, handleWithdrawnAndAllRewardsEvent)
      return () => {
        provider?.off(withdrawnEventFilter)
      }
    }
  }, [
    handleWithdrawnAndAllRewardsEvent,
    handleWithdrawnEvent,
    provider,
    withdrawnEventFilter,
  ])

  return null
}

export default memo(UnstakeEffects)
