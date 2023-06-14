import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from 'config/constants/queryKeys'
import { fetchPool } from 'lib/queries/fetchPool'
import { useChain } from 'hooks'

export function useFetchPool(options: UseFetchOptions = {}) {
  const {
    enabled = true,
    refetchInterval,
    refetchOnWindowFocus,
    suspense = true,
  } = options
  const { chainId } = useChain()

  return useQuery([QUERY_KEYS.Pool.Data, chainId], () => fetchPool(chainId), {
    enabled,
    staleTime: Infinity,
    refetchInterval,
    refetchOnWindowFocus,
    suspense,
    useErrorBoundary: false,
  })
}
