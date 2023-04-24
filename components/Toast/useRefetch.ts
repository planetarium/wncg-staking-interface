import { useCallback } from 'react'
import {
  useFetchStaking,
  useFetchUserAllowances,
  // useFetchLpPoolBalances,
  // useFetchUserAllowances,
  useFetchUserBalances,
  useFetchUserData,
} from 'hooks/queries'

export type RefetchOptions = {
  userData?: boolean
  allowances?: boolean
  balances?: boolean
  staking?: boolean
}

export function useRefetch() {
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

  const refetch = useCallback(() => {
    refetchBalances()
    refetchAllowances()
    refetchStaking()
    refetchUserData()
  }, [refetchAllowances, refetchBalances, refetchStaking, refetchUserData])

  return refetch
}
