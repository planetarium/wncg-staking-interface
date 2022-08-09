import { useCallback, useEffect } from 'react'
import { useInterval } from 'react-use'

import { useBpt } from './useBpt'
import { useReward } from './useReward'
import { useStake } from './useStake'
import { useUnstake } from './useUnstake'
import { useUserBalances } from './useUserBalances'

export function usePolling() {
  const { totalSupply } = useBpt()
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
    fetchWethBalance()
    fetchWncgBalance()
    getBalEmissionPerSec()
    getWncgEmissionPerSec()
    getTimestamps()
    stakedTokenBalance()
    totalSupply()
    totalStaked()
    unstakeWindow()
  }, [
    earmarkIncentive,
    earnedBal,
    earnedWncg,
    fetchBptBalance,
    fetchEthBalance,
    fetchWethBalance,
    fetchWncgBalance,
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
