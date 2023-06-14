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
    poolTokens: initPoolTokens,
  } = useStaking()

  const { lpToken = initLpToken, poolTokens = initPoolTokens } =
    useFetchPool().data ?? {}

  const setPriceMap = useSetAtom(priceMapAtom)

  const list = [...poolTokenAddresses, ...rewardTokenAddresses]

  return useQuery<PriceMap>(
    [QUERY_KEYS.Staking.Prices, chainId, ...list],
    () => fetchPrices(chainId, list),
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
      onSuccess(data) {
        setPriceMap((prev) => ({
          ...prev,
          ...data,
        }))
      },
    }
  )
}
