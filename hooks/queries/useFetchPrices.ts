import { useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from 'config/constants/queryKeys'
import { fetchPrice } from 'lib/queries/fetchPrice'
import { useChain } from 'hooks'

export function useFetchPrices(options: UseFetchOptions = {}) {
  const queryClient = useQueryClient()
  const {
    enabled = true,
    refetchInterval,
    refetchOnWindowFocus,
    suspense,
  } = options

  const { chainId } = useChain()

  const initialData = useMemo(
    () =>
      queryClient.getQueryData([QUERY_KEYS.Prices, chainId]) as
        | PriceMap
        | undefined,
    [chainId, queryClient]
  )

  return useQuery<PriceMap>(
    [QUERY_KEYS.Staking.Prices, chainId],
    () => fetchPrice(chainId),
    {
      enabled,
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchInterval,
      refetchOnWindowFocus,
      useErrorBoundary: false,
      suspense,
      initialData,
    }
  )
}
