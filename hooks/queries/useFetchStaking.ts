import { useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from 'config/constants/queryKeys'
import { fetchStaking } from 'lib/queries/fetchStaking'
import { useChain } from 'hooks'

type FetchStakingReturn = {
  totalStaked: string
  poolTokenBalances: string[]
  lpToken: any
}

export function useFetchStaking(options: UseFetchOptions = {}) {
  const queryClient = useQueryClient()
  const {
    enabled = true,
    refetchInterval,
    refetchOnWindowFocus,
    suspense = true,
  } = options

  const { chainId, stakingAddress } = useChain()

  const initialData = useMemo(
    () =>
      queryClient.getQueryData([QUERY_KEYS.Build, chainId]) as
        | FetchStakingReturn
        | undefined,
    [chainId, queryClient]
  )

  return useQuery<FetchStakingReturn>(
    [QUERY_KEYS.Staking.Data, stakingAddress, chainId],
    () => fetchStaking(chainId),
    {
      enabled,
      staleTime: Infinity,
      refetchInterval,
      refetchOnWindowFocus,
      suspense,
      useErrorBoundary: false,
      initialData,
    }
  )
}
