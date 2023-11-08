import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from 'config/constants/queryKeys'
import { fetchPrices } from 'lib/queries/fetchPrices'
import { useChain } from 'hooks'

export function useFetchPrices(options: UseFetchOptions = {}) {
  const {
    enabled = true,
    refetchInterval,
    refetchOnWindowFocus,
    suspense = true,
  } = options

  const { chainId } = useChain()

  return useQuery<PriceMap>(
    [QUERY_KEYS.Staking.Prices, chainId],
    () => fetchPrices(chainId),
    {
      staleTime: 5 * 1_000,
      enabled,
      cacheTime: Infinity,
      refetchInterval,
      refetchOnWindowFocus,
      useErrorBoundary: false,
      suspense,
    }
  )
}
