import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import config from 'config'
import { queryKeys } from 'config/queryKeys'
import { fetchUserAllowances } from 'lib/queries/fetchUserAllowances'
import { useAuth, useStaking } from 'hooks'

export function useFetchUserAllowances(options: UseFetchOptions = {}) {
  const {
    enabled = true,
    refetchInterval,
    refetchOnWindowFocus = 'always',
    suspense,
  } = options

  const { account } = useAuth()
  const { stakedTokenAddress, poolTokenAddresses, tokenMap } = useStaking()

  const pairAddressList: Hash[][] = useMemo(
    () => [
      [stakedTokenAddress, config.stakingAddress],
      ...poolTokenAddresses?.map((a) => [a, config.vault]),
    ],
    [poolTokenAddresses, stakedTokenAddress]
  )

  const pairs = useMemo(
    () =>
      pairAddressList.map(
        ([addr, spender]) => [tokenMap[addr], spender] as AllowancePair
      ),
    [pairAddressList, tokenMap]
  )

  return useQuery<AllowanceMap>(
    [queryKeys.User.Allowances, account!],
    () => fetchUserAllowances(pairs, account!),
    {
      enabled,
      staleTime: Infinity,
      refetchInterval,
      refetchOnWindowFocus,
      suspense,
      useErrorBoundary: false,
    }
  )
}
