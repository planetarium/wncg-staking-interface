import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from 'config/constants/queryKeys'
import { fetchPrice } from 'lib/queries/fetchPrice'
import { calcLpTokenPrice } from 'utils/calcLpTokenPrice'
import { useChain, useStaking } from 'hooks'
import { useFetchPool } from './useFetchPool'

export function useFetchPrices(options: UseFetchOptions = {}) {
  const {
    enabled = true,
    refetchInterval,
    refetchOnWindowFocus,
    suspense,
  } = options

  const { chainId } = useChain()
  const { lpToken: initLpToken, poolTokens: initPoolTokens } = useStaking()

  const { lpToken = initLpToken, poolTokens = initPoolTokens } =
    useFetchPool().data ?? {}

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
      select(data) {
        const lpTokenPrice = calcLpTokenPrice(
          chainId,
          poolTokens,
          lpToken?.address,
          lpToken?.totalSupply ?? '0',
          data
        )

        return {
          ...data,
          ...lpTokenPrice,
        }
      },
    }
  )
}
