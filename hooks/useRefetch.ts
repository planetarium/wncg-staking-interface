import { useCallback } from 'react'

import {
  useFetchStaking,
  useFetchUserAllowances,
  useFetchPoolSnapshot,
  useFetchUserBalances,
  useFetchUserData,
  useFetchUserRewards,
} from 'hooks/queries'

export type RefetchOptions = {
  userAllowances?: boolean
  userBalances?: boolean
  userData?: boolean
  userRewards?: boolean
  staking?: boolean
  pool?: boolean
  poolSnapshot?: boolean
  prices?: boolean
}

export function useRefetch(options: RefetchOptions = {}) {
  const {
    userData,
    userAllowances,
    userBalances,
    userRewards,
    staking,
    pool,
    poolSnapshot,
    prices,
  } = options

  const { refetch: refetchAllowances } = useFetchUserAllowances({
    suspense: false,
  })

  const { refetch: refetchStaking } = useFetchStaking({
    suspense: false,
  })

  const { refetch: refetchBalances } = useFetchUserBalances({
    suspense: false,
  })

  const { refetch: refetchUserData } = useFetchUserData({
    suspense: false,
  })

  const { refetch: refetchUserRewards } = useFetchUserRewards({
    suspense: false,
  })

  const { refetch: refetchPoolSnapshot } = useFetchPoolSnapshot({
    suspense: false,
  })

  const refetch = useCallback(async () => {
    if (poolSnapshot) refetchPoolSnapshot()
    if (prices) refetchPoolSnapshot()
    if (staking || pool) refetchStaking()
    if (userAllowances) refetchAllowances()
    if (userBalances) refetchBalances()
    if (userData) refetchUserData()
    if (userRewards) refetchUserRewards()
  }, [
    pool,
    poolSnapshot,
    prices,
    refetchAllowances,
    refetchBalances,
    refetchPoolSnapshot,
    refetchStaking,
    refetchUserData,
    refetchUserRewards,
    staking,
    userAllowances,
    userBalances,
    userData,
    userRewards,
  ])

  return refetch
}
