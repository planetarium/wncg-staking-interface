import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from 'config/constants/queryKeys'
import { fetchPool } from 'lib/queries/fetchPool'
import { useChain, useStaking } from 'hooks'

export function useFetchPool(options: UseFetchOptions = {}) {
  const {
    enabled: _enabled = true,
    refetchInterval,
    refetchOnWindowFocus,
    suspense = true,
  } = options

  const { chainId } = useChain()
  const { lpToken } = useStaking()

  const enabled = _enabled && !!lpToken.address

  return useQuery(
    [QUERY_KEYS.Pool.Data, chainId, lpToken.address],
    () => fetchPool(chainId, lpToken.address),
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
