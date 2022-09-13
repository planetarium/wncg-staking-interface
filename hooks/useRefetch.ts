import { useCallback } from 'react'
import { useAllowances } from './useAllowances'
import { useBalances } from './useBalances'
import { useEarmarkIncentive } from './useEarmarkIncentive'
import { usePool } from './usePool'
import { useRewards } from './useRewards'
import { useStakedBalance } from './useStakedBalance'
import { useStaking } from './useStaking'
import { useUnstakeTimestamps } from './useUnstakeTimestamps'

export function useRefetch() {
  const { fetchAllowances } = useAllowances()
  const { fetchBalances } = useBalances()
  const { fetchEarmarkIncentive } = useEarmarkIncentive()
  const { fetchPool } = usePool()
  const { fetchRewards } = useRewards()
  const { fetchStakedBalance } = useStakedBalance()
  const { fetchStaking } = useStaking()
  const { fetchTimestamps } = useUnstakeTimestamps()

  const refetch = useCallback(() => {
    fetchAllowances()
    fetchBalances()
    fetchEarmarkIncentive()
    fetchPool()
    fetchRewards()
    fetchStakedBalance()
    fetchStaking()
    fetchTimestamps()
  }, [
    fetchAllowances,
    fetchBalances,
    fetchEarmarkIncentive,
    fetchPool,
    fetchRewards,
    fetchStakedBalance,
    fetchStaking,
    fetchTimestamps,
  ])

  return refetch
}
