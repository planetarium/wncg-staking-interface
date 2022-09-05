import { memo, useCallback, useEffect } from 'react'
import type { Event } from 'ethers'

import { TxAction } from 'services/transaction'
import { useBalances, useEvents, useProvider, useTx } from 'hooks'

function PoolEffects() {
  const { fetchBalances } = useBalances()
  const { poolBalanceChangedEvent } = useEvents()
  const provider = useProvider()
  const { handleTx } = useTx()

  const poolBalanceChangedHandler = useCallback(
    async (event: Event) => {
      await handleTx?.(event, TxAction.JoinPool, {
        onTxEvent: fetchBalances,
      })

      await handleTx?.(event, TxAction.ExitPool, {
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
