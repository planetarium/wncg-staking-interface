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
import { TransactionAction } from 'services/transaction'

function StakeEffects() {
  const { fetchBalances } = useBalances()
  const { stakedEventFilter } = useEventFilters()
  const provider = useProvider()
  const { fetchStakedBalance } = useStakedBalance()
  const { fetchTotalStaked } = useStaking()
  const { updateTxStatus } = useTransaction()
  const { fetchTimestamps } = useUnstakeTimestamps()

  // useEffect(() => {
  //   stakedTokenBalance()
  // }, [stakedTokenBalance])

  const handleStakedEvent = useCallback(
    async (event: Event) => {
      await updateTxStatus?.(event, TransactionAction.Stake, {
        onFulfill: () => {
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
      updateTxStatus,
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
