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
  const { fetchRewards } = useRewards()
  const { fulfillTx } = useTx()

  const rewardsClaimedAllHandler = useCallback(
    async ({ transactionHash }: Event) => {
      await fulfillTx?.(transactionHash, TxAction.ClaimAll)
    },
    [fulfillTx]
  )

  const rewardsClaimedBalHandler = useCallback(
    async ({ transactionHash }: Event) => {
      await fulfillTx?.(transactionHash, TxAction.ClaimBal)
    },
    [fulfillTx]
  )

  const rewardsClaimedWncgHandler = useCallback(
    async ({ transactionHash }: Event) => {
      await fulfillTx?.(transactionHash, TxAction.ClaimWncg, fetchRewards)
    },
    [fetchRewards, fulfillTx]
  )

  const earmarkRewardsHandler = useCallback(
    async ({ transactionHash }: Event) => {
      await fulfillTx?.(transactionHash, TxAction.EarmarkRewards, () => {
        fetchEarmarkIncentive()
        fetchRewards()
      })
    },
    [fetchEarmarkIncentive, fetchRewards, fulfillTx]
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
