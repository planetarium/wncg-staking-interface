import { memo, useCallback, useEffect, useMemo } from 'react'
import { Event } from 'ethers'

import { TxAction } from 'services/transaction'
import {
  useEarmarkIncentive,
  useEvents,
  useProvider,
  useRewards,
  useTx,
} from 'hooks'

function RewardEffects() {
  const {
    rewardsClaimedAllEvent,
    rewardsClaimedBalEvent,
    rewardsClaimedWncgEvent,
    earmarkRewardsEvent,
  } = useEvents()
  const provider = useProvider()
  const { fetchEarmarkIncentive } = useEarmarkIncentive()
  const { handleTx } = useTx()
  const { fetchRewards } = useRewards()

  const option = useMemo(
    () => ({
      onTxConfirmed: fetchRewards,
    }),
    [fetchRewards]
  )

  const rewardsClaimedAllHandler = useCallback(
    async (event: Event) => {
      await handleTx?.(event, TxAction.ClaimAll, option)
    },
    [handleTx, option]
  )

  const rewardsClaimedBalHandler = useCallback(
    async (event: Event) => {
      await handleTx?.(event, TxAction.ClaimBal, option)
    },
    [handleTx, option]
  )

  const rewardsClaimedWncgHandler = useCallback(
    async (event: Event) => {
      await handleTx?.(event, TxAction.ClaimWncg, option)
    },
    [handleTx, option]
  )

  const earmarkRewardsHandler = useCallback(
    async (event: Event) => {
      await handleTx?.(event, TxAction.EarmarkRewards, {
        onTxConfirmed: () => {
          fetchEarmarkIncentive()
          fetchRewards()
        },
      })
    },
    [fetchEarmarkIncentive, fetchRewards, handleTx]
  )

  // NOTE: Reward All event
  useEffect(() => {
    if (rewardsClaimedAllEvent) {
      provider?.on(rewardsClaimedAllEvent, rewardsClaimedAllHandler)
      return () => {
        provider?.off(rewardsClaimedAllEvent)
      }
    }
  }, [provider, rewardsClaimedAllEvent, rewardsClaimedAllHandler])

  // NOTE: Reward BAL event
  useEffect(() => {
    if (rewardsClaimedBalEvent) {
      provider?.on(rewardsClaimedBalEvent, rewardsClaimedBalHandler)
      return () => {
        provider?.off(rewardsClaimedBalEvent)
      }
    }
  }, [provider, rewardsClaimedBalEvent, rewardsClaimedBalHandler])

  // NOTE: Reward WNCG event
  useEffect(() => {
    if (rewardsClaimedWncgEvent) {
      provider?.on(rewardsClaimedWncgEvent, rewardsClaimedWncgHandler)
      return () => {
        provider?.off(rewardsClaimedWncgEvent)
      }
    }
  }, [provider, rewardsClaimedWncgEvent, rewardsClaimedWncgHandler])

  // NOTE: Earmark rewards event
  useEffect(() => {
    if (earmarkRewardsEvent) {
      provider?.on(earmarkRewardsEvent, earmarkRewardsHandler)
      return () => {
        provider?.off(earmarkRewardsEvent)
      }
    }
  }, [earmarkRewardsEvent, earmarkRewardsHandler, provider])

  return null
}

export default memo(RewardEffects)
