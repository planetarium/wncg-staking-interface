import { useCallback } from 'react'
import {
  useFetchStaking,
  useFetchUserAllowances,
  useFetchPoolSnapshot,
  useFetchUserBalances,
  useFetchUserData,
  useFetchPool,
} from 'hooks/queries'

export type RefetchOptions = {
  userData?: boolean
  userAllowances?: boolean
  userBalances?: boolean
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
    staking,
    poolSnapshot,
    prices,
    pool,
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

  const { refetch: refetchPoolSnapshot } = useFetchPoolSnapshot({
    suspense: false,
  })

  const { refetch: refetchPool } = useFetchPool({
    suspense: false,
  })

  const refetch = useCallback(() => {
    if (userBalances) refetchBalances()
    if (userAllowances) refetchAllowances()
    if (staking) refetchStaking()
    if (userData) refetchUserData()
    if (poolSnapshot) refetchPoolSnapshot()
    if (prices) refetchPoolSnapshot()
    if (pool) refetchPool()
  }, [
    userAllowances,
    userBalances,
    pool,
    poolSnapshot,
    prices,
    refetchAllowances,
    refetchBalances,
    refetchPool,
    refetchPoolSnapshot,
    refetchStaking,
    refetchUserData,
    staking,
    userData,
  ])

  return refetch
}
