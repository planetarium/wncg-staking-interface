import { memo, useCallback, useEffect } from 'react'
import { Event } from 'ethers'

import {
  useBalances,
  useEventFilters,
  useProvider,
  useRewardData,
  useStakingData,
  useTransaction,
  useUnstake,
} from 'hooks'

function UnstakeEffects() {
  const { fetchBalances } = useBalances()
  const { cooldownEventFilter, withdrawnEventFilter } = useEventFilters()
  const provider = useProvider()
  // const { stakedTokenBalance } = useStake()
  const { fetchRewards } = useRewardData()
  const { fetchTotalStaked } = useStakingData()

  const { transactionService } = useTransaction()
  const { fetchTimestamps } = useUnstake()

  // useEffect(() => {
  //   getTimestamps()
  // }, [getTimestamps])

  const handleCooldownEvent = useCallback(
    async (event: Event) => {
      await transactionService?.updateTxStatus(event, {
        onFulfill: () => {
          fetchTimestamps()
        },
      })
    },
    [fetchTimestamps, transactionService]
  )

  const handleWithdrawnEvent = useCallback(
    async (event: Event) => {
      await transactionService?.updateTxStatus(event, {
        onFulfill: () => {
          // stakedTokenBalance()
          fetchBalances()
          fetchTotalStaked()
        },
      })
    },
    [fetchBalances, fetchTotalStaked, transactionService]
  )

  const handleWithdrawnAndAllRewardsEvent = useCallback(
    async (event: Event) => {
      await transactionService?.updateTxStatus(
        event,
        {
          onFulfill: () => {
            fetchRewards()
            fetchBalances()
            // stakedTokenBalance()
            fetchTotalStaked()
          },
        },
        'withdrawAndClaim'
      )
    },
    [
      fetchBalances,
      fetchRewards,
      fetchTotalStaked,
      // stakedTokenBalance,
      transactionService,
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
