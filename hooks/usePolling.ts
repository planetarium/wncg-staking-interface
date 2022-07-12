import { useCallback, useEffect } from 'react'
import { useInterval } from 'react-use'

import { useBpt } from './useBpt'
import { useReward } from './useReward'
import { useStake } from './useStake'
import { useUnstake } from './useUnstake'

export function usePolling() {
  const { balanceOf, totalSupply } = useBpt()
  const {
    earmarkIncentive,
    earnedBal,
    earnedWncg,
    getBalEmissionPerSec,
    getWncgEmissionPerSec,
  } = useReward()
  const { stakedTokenBalance, totalStaked } = useStake()
  const { getTimestamps, unstakeWindow } = useUnstake()

  const refetch = useCallback(() => {
    balanceOf()
    earmarkIncentive()
    earnedBal()
    earnedWncg()
    getBalEmissionPerSec()
    getWncgEmissionPerSec()
    getTimestamps()
    stakedTokenBalance()
    totalSupply()
    totalStaked()
    unstakeWindow()
  }, [
    balanceOf,
    earmarkIncentive,
    earnedBal,
    earnedWncg,
    getBalEmissionPerSec,
    getTimestamps,
    getWncgEmissionPerSec,
    stakedTokenBalance,
    totalStaked,
    totalSupply,
    unstakeWindow,
  ])

  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'visible') {
      refetch()
    }
  }, [refetch])

  useInterval(refetch, 1_000 * 60)

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [handleVisibilityChange, refetch])
}
