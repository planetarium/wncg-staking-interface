import { memo, useCallback, useEffect, useMemo } from 'react'
import { Event } from 'ethers'

import { TransactionAction } from 'services/transaction'
import {
  useEarmarkIncentive,
  useEventFilters,
  useProvider,
  useRewards,
  useTransaction,
} from 'hooks'

function RewardEffects() {
  const {
    earmarkEventFilter,
    rewardsAllEventFilter,
    rewardsBalEventFilter,
    rewardsWncgEventFilter,
  } = useEventFilters()
  const provider = useProvider()
  const { fetchEarmarkIncentive } = useEarmarkIncentive()
  const { updateTxStatus } = useTransaction()
  const { fetchRewards } = useRewards()

  const option = useMemo(
    () => ({
      onFulfill: fetchRewards,
    }),
    [fetchRewards]
  )

  const handleAllRewardEvent = useCallback(
    async (event: Event) => {
      await updateTxStatus?.(event, TransactionAction.ClaimAllRewards, option)
    },
    [option, updateTxStatus]
  )

  const handleBalRewardEvent = useCallback(
    async (event: Event) => {
      await updateTxStatus?.(event, TransactionAction.ClaimBalRewards, option)
    },
    [option, updateTxStatus]
  )

  const handleWncgRewardEvent = useCallback(
    async (event: Event) => {
      await updateTxStatus?.(event, TransactionAction.ClaimWncgRewards, option)
    },
    [option, updateTxStatus]
  )

  const handleEarmarkRewardsEvent = useCallback(
    async (event: Event) => {
      await updateTxStatus?.(event, TransactionAction.EarmarkRewards, {
        onFulfill: () => {
          fetchEarmarkIncentive()
          fetchRewards()
        },
      })
    },
    [fetchEarmarkIncentive, fetchRewards, updateTxStatus]
  )

  // NOTE: Reward All event
  useEffect(() => {
    if (rewardsAllEventFilter) {
      provider?.on(rewardsAllEventFilter, handleAllRewardEvent)
      return () => {
        provider?.off(rewardsAllEventFilter)
      }
    }
  }, [handleAllRewardEvent, provider, rewardsAllEventFilter])

  // NOTE: Reward BAL event
  useEffect(() => {
    if (rewardsBalEventFilter) {
      provider?.on(rewardsBalEventFilter, handleBalRewardEvent)
      return () => {
        provider?.off(rewardsBalEventFilter)
      }
    }
  }, [handleBalRewardEvent, provider, rewardsBalEventFilter])

  // NOTE: Reward WNCG event
  useEffect(() => {
    if (rewardsWncgEventFilter) {
      provider?.on(rewardsWncgEventFilter, handleWncgRewardEvent)
      return () => {
        provider?.off(rewardsWncgEventFilter)
      }
    }
  }, [handleWncgRewardEvent, provider, rewardsWncgEventFilter])

  // NOTE: Earmark rewards event
  useEffect(() => {
    if (earmarkEventFilter) {
      provider?.on(earmarkEventFilter, handleEarmarkRewardsEvent)
      return () => {
        provider?.off(earmarkEventFilter)
      }
    }
  }, [provider, handleEarmarkRewardsEvent, earmarkEventFilter])

  return null
}

export default memo(RewardEffects)
