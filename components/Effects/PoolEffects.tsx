import { memo, useCallback, useEffect } from 'react'
import type { Event } from 'ethers'

import {
  useBalances,
  useEventFilters,
  useProvider,
  useTransaction,
} from 'hooks'
import { TxAction } from 'services/transaction'

function PoolEffects() {
  const { fetchBalances } = useBalances()
  const { poolBalanceChangedEventFilter } = useEventFilters()
  const provider = useProvider()
  const { handleTx } = useTransaction()

  const handlePoolBalanceChangedEvent = useCallback(
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
    if (poolBalanceChangedEventFilter) {
      provider?.on(poolBalanceChangedEventFilter, handlePoolBalanceChangedEvent)
      return () => {
        provider?.off(poolBalanceChangedEventFilter)
      }
    }
  })

  return null
}

export default memo(PoolEffects)
