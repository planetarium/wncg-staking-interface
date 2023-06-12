import { useQuery } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'

import { priceMapAtom } from 'states/system'
import { QUERY_KEYS } from 'config/constants/queryKeys'
import { fetchPrices } from 'lib/queries/fetchPrices'
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
  const {
    lpToken: initLpToken,
    rewardTokenAddresses,
    poolTokenAddresses,
  } = useStaking()

  const { lpToken = initLpToken, poolTokens = [] } = useFetchPool().data ?? {}

  const setPriceMap = useSetAtom(priceMapAtom)

  return useQuery<PriceMap>(
    [QUERY_KEYS.Staking.Prices, chainId],
    () =>
      fetchPrices(chainId, [...poolTokenAddresses, ...rewardTokenAddresses]),
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
          lpToken.address,
          lpToken.totalSupply,
          data
        )

        return {
          ...data,
          ...lpTokenPrice,
        }
      },
      onSuccess(data) {
        setPriceMap((prev) => ({
          ...prev,
          ...data,
        }))
      },
    }
  )
}
