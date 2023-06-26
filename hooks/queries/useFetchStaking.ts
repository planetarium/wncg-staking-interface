import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from 'config/constants/queryKeys'
import { fetchStaking } from 'lib/queries/fetchStaking'
import { useChain } from 'hooks'

export function useFetchStaking(options: UseFetchOptions = {}) {
  const {
    enabled = true,
    refetchInterval,
    refetchOnWindowFocus,
    suspense = true,
  } = options

  const { chainId, stakingAddress } = useChain()

  return useQuery(
    [QUERY_KEYS.Staking.Data, stakingAddress, chainId],
    () => fetchStaking(chainId),
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
