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
import { TxAction } from 'services/transaction'

function UnstakeEffects() {
  const { fetchBalances } = useBalances()
  const { cooldownEventFilter, withdrawnEventFilter } = useEventFilters()
  const provider = useProvider()
  const { fetchStakedBalance } = useStakedBalance()
  const { fetchRewards } = useRewards()
  const { fetchTotalStaked } = useStaking()
  const { handleTx } = useTransaction()
  const { fetchTimestamps } = useUnstakeTimestamps()

  const handleCooldownEvent = useCallback(
    async (event: Event) => {
      await handleTx?.(event, TxAction.StartCooldown, {
        onTxConfirmed: () => {
          fetchTimestamps()
        },
      })
    },
    [fetchTimestamps, handleTx]
  )

  const handleWithdrawnEvent = useCallback(
    async (event: Event) => {
      await handleTx?.(event, TxAction.Withdraw, {
        onTxEvent: () => {
          fetchStakedBalance()
          fetchBalances()
          fetchTotalStaked()
        },
      })
    },
    [fetchBalances, fetchStakedBalance, fetchTotalStaked, handleTx]
  )

  const handleWithdrawnAndAllRewardsEvent = useCallback(
    async (event: Event) => {
      await handleTx?.(event, TxAction.WithdrawAndClaim, {
        onTxEvent: () => {
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
      handleTx,
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
