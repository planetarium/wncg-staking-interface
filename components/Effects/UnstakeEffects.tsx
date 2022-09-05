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
  const { handleTx } = useTx()
  const { fetchTimestamps } = useUnstakeTimestamps()

  const cooldownHandler = useCallback(
    async (event: Event) => {
      await handleTx?.(event, TxAction.Cooldown, {
        onTxConfirmed: () => {
          fetchTimestamps()
        },
      })
    },
    [fetchTimestamps, handleTx]
  )

  const withdrawnHandler = useCallback(
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

  const withdrawnAndClaimedHandler = useCallback(
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
