import { memo, useCallback, useEffect } from 'react'
import type { Event } from 'ethers'

import {
  useBalances,
  useEventFilters,
  useProvider,
  useTransaction,
} from 'hooks'
import { TransactionAction } from 'services/transaction'

function PoolEffects() {
  const { fetchBalances } = useBalances()
  const { poolBalanceChangedEventFilter } = useEventFilters()
  const provider = useProvider()
  const { updateTxStatus } = useTransaction()

  const handlePoolBalanceChangedEvent = useCallback(
    async (event: Event) => {
      console.log(3433, 'poolchangedevent', event)

      // Join인지 Exit인지 어떻게 구별하지
      await updateTxStatus?.(event, TransactionAction.JoinPool, {
        onFulfill: fetchBalances,
      })
    },
    [fetchBalances, updateTxStatus]
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
