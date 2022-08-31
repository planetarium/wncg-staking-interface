import { memo, useCallback, useEffect } from 'react'
import { Event } from 'ethers'

import {
  useBalances,
  useEventFilters,
  useProvider,
  useStakedBalance,
  useStaking,
  useTransaction,
  useUnstakeTimestamps,
} from 'hooks'
import { TxAction } from 'services/transaction'

function StakeEffects() {
  const { fetchBalances } = useBalances()
  const { stakedEventFilter } = useEventFilters()
  const provider = useProvider()
  const { fetchStakedBalance } = useStakedBalance()
  const { fetchTotalStaked } = useStaking()
  const { handleTx } = useTransaction()
  const { fetchTimestamps } = useUnstakeTimestamps()

  const handleStakedEvent = useCallback(
    async (event: Event) => {
      await handleTx?.(event, TxAction.Stake, {
        onTxEvent: () => {
          fetchStakedBalance()
          fetchBalances()
          fetchTotalStaked()
          fetchTimestamps()
        },
      })
    },
    [
      fetchBalances,
      fetchTimestamps,
      fetchTotalStaked,
      fetchStakedBalance,
      handleTx,
    ]
  )

  // NOTE: Staked event
  useEffect(() => {
    if (stakedEventFilter) {
      provider?.on(stakedEventFilter, handleStakedEvent)
      return () => {
        provider?.off(stakedEventFilter)
      }
    }
  }, [handleStakedEvent, provider, stakedEventFilter])

  return null
}

export default memo(StakeEffects)
