import { useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from 'config/constants/queryKeys'
import { useChain, useStaking } from 'hooks'
import { fetchProject } from 'lib/queries/fetchProject'

export function useFetchPool(options: UseFetchOptions = {}) {
  const queryClient = useQueryClient()
  const {
    enabled: _enabled = true,
    refetchInterval,
    refetchOnWindowFocus,
    suspense = true,
  } = options

  const { chainId } = useChain()
  const { lpToken } = useStaking()

  const enabled = _enabled && !!lpToken?.address

  const initialData = useMemo(
    () => queryClient.getQueryData([QUERY_KEYS.Build, chainId]),
    [chainId, queryClient]
  )

  return useQuery(
    [QUERY_KEYS.Pool.Data, chainId, lpToken?.address],
    () => fetchProject(chainId),
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
