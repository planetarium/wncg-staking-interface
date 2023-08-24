import { useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from 'config/constants/queryKeys'
import { fetchProject } from 'lib/queries/fetchProject'
import { useChain } from 'hooks'

type FetchStakingReturn = {
  totalStaked: string
  poolTokenBalances: string[]
}

export function useFetchStaking(options: UseFetchOptions = {}) {
  const queryClient = useQueryClient()
  const {
    enabled = true,
    refetchInterval,
    refetchOnWindowFocus,
    suspense,
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
    () => fetchProject(chainId),
    {
      enabled,
      staleTime: Infinity,
      refetchInterval,
      refetchOnWindowFocus,
      suspense,
      useErrorBoundary: false,
      initialData,
      onSuccess() {
        console.log('💖')
      },
    }
  )
}
