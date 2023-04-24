import { useQuery } from '@tanstack/react-query'
import { queryKeys } from 'config/queryKeys'
import { fetchPoolSnapshot } from 'lib/queries/fetchPoolSnapshot'

export function useFetchPoolSnapshot(options: UseFetchOptions = {}) {
  const {
    enabled = true,
    refetchInterval,
    refetchOnWindowFocus = 'always',
    suspense = true,
  } = options

  return useQuery([queryKeys.Pool.Snapshot], () => fetchPoolSnapshot(), {
    enabled,
    staleTime: Infinity,
    refetchInterval,
    refetchOnWindowFocus,
    suspense,
    useErrorBoundary: false,
  })
}
