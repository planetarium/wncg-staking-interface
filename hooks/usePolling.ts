import { useCallback, useEffect } from 'react'
import { useInterval } from 'react-use'

import { useBalances } from './useBalances'
import { useEarmark } from './useEarmark'
import { useRewardData } from './useRewardData'
import { useStake } from './useStake'
import { useStakingData } from './useStakingData'
import { useUnstake } from './useUnstake'

export function usePolling() {
  const { fetchBalances } = useBalances()
  const { fetchEarmarkIncentive } = useEarmark()
  const { fetchRewards } = useRewardData()
  const { stakedTokenBalance } = useStake()
  const { fetchTotalStaked } = useStakingData()
  const { fetchTimestamps } = useUnstake()

  const refetch = useCallback(() => {
    fetchEarmarkIncentive()
    fetchRewards()
    fetchBalances()
    fetchTimestamps()
    // stakedTokenBalance()
    fetchTotalStaked()
  }, [
    fetchEarmarkIncentive,
    fetchBalances,
    fetchRewards,
    fetchTimestamps,
    // stakedTokenBalance,
    fetchTotalStaked,
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
