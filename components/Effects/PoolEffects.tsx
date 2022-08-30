import { memo, useCallback, useEffect } from 'react'
import type { Event } from 'ethers'

import {
  useBalances,
  useEventFilters,
  useProvider,
  useTransaction,
} from 'hooks'

function PoolEffects() {
  const { fetchBalances } = useBalances()
  const { poolBalanceChangedEventFilter } = useEventFilters()
  const provider = useProvider()
  const { transactionService } = useTransaction()

  const handlePoolBalanceChangedEvent = useCallback(
    async (event: Event) => {
      console.log(3433, 'poolchangedevent', event)

      await transactionService?.updateTxStatus(event, {
        onFulfill: fetchBalances,
      })
    },
    [fetchBalances, transactionService]
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
