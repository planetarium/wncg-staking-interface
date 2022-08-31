import { memo, useCallback, useEffect } from 'react'
import { Event } from 'ethers'

import {
  useBalances,
  useEvents,
  useProvider,
  useStakedBalance,
  useStaking,
  useTx,
  useUnstakeTimestamps,
} from 'hooks'
import { TxAction } from 'services/transaction'

function StakeEffects() {
  const { fetchBalances } = useBalances()
  const { stakedEvent } = useEvents()
  const provider = useProvider()
  const { fetchStakedBalance } = useStakedBalance()
  const { fetchTotalStaked } = useStaking()
  const { handleTx } = useTx()
  const { fetchTimestamps } = useUnstakeTimestamps()

  const stakedHandler = useCallback(
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
    if (stakedEvent) {
      provider?.on(stakedEvent, stakedHandler)
      return () => {
        provider?.off(stakedEvent)
      }
    }
  }, [stakedHandler, provider, stakedEvent])

  return null
}

export default memo(StakeEffects)
