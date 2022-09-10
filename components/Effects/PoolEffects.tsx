import { memo, useCallback, useEffect } from 'react'
import type { Event } from 'ethers'

import { TxAction } from 'services/transaction'
import { useBalances, useEvents, useProvider, useTx } from 'hooks'

function PoolEffects() {
  const { fetchBalances } = useBalances()
  const { poolBalanceChangedEvent } = useEvents()
  const provider = useProvider()
  const { fulfillTx } = useTx()

  const poolBalanceChangedHandler = useCallback(
    async ({ transactionHash }: Event) => {
      await fulfillTx?.(transactionHash, TxAction.JoinPool, fetchBalances)
      await fulfillTx?.(transactionHash, TxAction.ExitPool, fetchBalances)
    },
    [fetchBalances, fulfillTx]
  )

  // NOTE: Pool balance changed event (Join / Exit)
  useEffect(() => {
    if (poolBalanceChangedEvent) {
      provider?.on(poolBalanceChangedEvent, poolBalanceChangedHandler)
      return () => {
        provider?.off(poolBalanceChangedEvent)
      }
    }
  })

  return null
}

export default memo(PoolEffects)
