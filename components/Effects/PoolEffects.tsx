import { memo, useCallback, useEffect } from 'react'
import type { Event } from 'ethers'

import { useBalances, useEvents, useProvider, useTx } from 'hooks'
import { TxAction } from 'services/transaction'

function PoolEffects() {
  const { fetchBalances } = useBalances()
  const { poolBalanceChangedEvent } = useEvents()
  const provider = useProvider()
  const { handleTx } = useTx()

  const poolBalanceChangedHandler = useCallback(
    async (event: Event) => {
      // FIXME: How to identify join/exit pool transactions
      await handleTx?.(event, TxAction.JoinPool, {
        onTxEvent: fetchBalances,
      })
    },
    [fetchBalances, handleTx]
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
