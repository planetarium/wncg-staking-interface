import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from 'config/constants/queryKeys'
import { useChain } from 'hooks/useChain'
import { fetchPoolSnapshot } from 'lib/queries/fetchPoolSnapshot'

// FIXME: Pool은 발란서에만 존재하나?
export function useFetchPoolSnapshot(options: UseFetchOptions = {}) {
  const { chainId } = useChain()

  const {
    enabled = true,
    refetchInterval,
    refetchOnWindowFocus = 'always',
    suspense,
  } = options

  return useQuery(
    [QUERY_KEYS.Pool.Snapshot, chainId],
    () => fetchPoolSnapshot(chainId),
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
