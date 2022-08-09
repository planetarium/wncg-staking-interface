import { useCallback, useEffect } from 'react'
import { useInterval } from 'react-use'

import { useFetchPool } from './useFetchPool'
import { useReward } from './useReward'
import { useStake } from './useStake'
import { useUnstake } from './useUnstake'
import { useUserBalances } from './useUserBalances'

export function usePolling() {
  const { fetchPool } = useFetchPool()
  const {
    earmarkIncentive,
    earnedBal,
    earnedWncg,
    getBalEmissionPerSec,
    getWncgEmissionPerSec,
  } = useReward()
  const { stakedTokenBalance, totalStaked } = useStake()
  const { getTimestamps, unstakeWindow } = useUnstake()
  const {
    fetchBptBalance,
    fetchEthBalance,
    fetchWethBalance,
    fetchWncgBalance,
  } = useUserBalances()

  const refetch = useCallback(() => {
    earmarkIncentive()
    earnedBal()
    earnedWncg()
    fetchBptBalance()
    fetchEthBalance()
    fetchPool()
    fetchWethBalance()
    fetchWncgBalance()
    getBalEmissionPerSec()
    getWncgEmissionPerSec()
    getTimestamps()
    stakedTokenBalance()
    totalStaked()
    unstakeWindow()
  }, [
    earmarkIncentive,
    earnedBal,
    earnedWncg,
    fetchBptBalance,
    fetchEthBalance,
    fetchPool,
    fetchWethBalance,
    fetchWncgBalance,
    getBalEmissionPerSec,
    getTimestamps,
    getWncgEmissionPerSec,
    stakedTokenBalance,
    totalStaked,
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
