import { memo, useCallback, useEffect } from 'react'
import { Event } from 'ethers'

import { TxAction } from 'services/transaction'
import {
  useBalances,
  useEvents,
  useProvider,
  useRewards,
  useStakedBalance,
  useStaking,
  useTx,
  useUnstakeTimestamps,
} from 'hooks'

function UnstakeEffects() {
  const { fetchBalances } = useBalances()
  const { cooldownEvent, withdrawnEvent } = useEvents()
  const provider = useProvider()
  const { fetchStakedBalance } = useStakedBalance()
  const { fetchRewards } = useRewards()
  const { fetchTotalStaked } = useStaking()
  const { fulfillTx } = useTx()
  const { fetchTimestamps } = useUnstakeTimestamps()

  const cooldownHandler = useCallback(
    async ({ transactionHash }: Event) => {
      await fulfillTx?.(transactionHash, TxAction.Cooldown, fetchTimestamps)
    },
    [fetchTimestamps, fulfillTx]
  )

  const withdrawnHandler = useCallback(
    async ({ transactionHash }: Event) => {
      await fulfillTx?.(transactionHash, TxAction.Withdraw, () => {
        fetchStakedBalance()
        fetchBalances()
        fetchTotalStaked()
      })
    },
    [fetchBalances, fetchStakedBalance, fetchTotalStaked, fulfillTx]
  )

  const withdrawnAndClaimedHandler = useCallback(
    async ({ transactionHash }: Event) => {
      await fulfillTx?.(transactionHash, TxAction.WithdrawAndClaim, () => {
        fetchRewards()
        fetchBalances()
        fetchStakedBalance()
        fetchTotalStaked()
      })
    },
    [
      fetchBalances,
      fetchRewards,
      fetchTotalStaked,
      fetchStakedBalance,
      fulfillTx,
    ]
  )

  // NOTE: Cooldown event
  useEffect(() => {
    if (cooldownEvent) {
      provider?.on(cooldownEvent, cooldownHandler)
      return () => {
        provider?.off(cooldownEvent)
      }
    }
  }, [cooldownEvent, cooldownHandler, provider])

  // NOTE: Withdrawn event
  useEffect(() => {
    if (withdrawnEvent) {
      provider?.on(withdrawnEvent, withdrawnHandler)
      provider?.on(withdrawnEvent, withdrawnAndClaimedHandler)
      return () => {
        provider?.off(withdrawnEvent)
      }
    }
  }, [provider, withdrawnAndClaimedHandler, withdrawnEvent, withdrawnHandler])

  return null
}

export default memo(UnstakeEffects)
