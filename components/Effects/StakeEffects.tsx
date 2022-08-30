import { memo, useCallback, useEffect } from 'react'
import { Event } from 'ethers'

import {
  useBalances,
  useEventFilters,
  useProvider,
  useStake,
  useStakingData,
  useTransaction,
  useUnstake,
} from 'hooks'

function StakeEffects() {
  const { fetchBalances } = useBalances()
  const { stakedEventFilter } = useEventFilters()
  const provider = useProvider()
  const { stakedTokenBalance } = useStake()
  const { fetchTotalStaked } = useStakingData()
  const { transactionService } = useTransaction()
  const { fetchTimestamps } = useUnstake()

  // useEffect(() => {
  //   stakedTokenBalance()
  // }, [stakedTokenBalance])

  const handleStakedEvent = useCallback(
    async (event: Event) => {
      await transactionService?.updateTxStatus(event, {
        onFulfill: () => {
          stakedTokenBalance()
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
      stakedTokenBalance,
      transactionService,
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
