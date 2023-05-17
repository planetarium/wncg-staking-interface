import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'

import { queryKeys } from 'config/queryKeys'
import { useStaking } from 'hooks/useStaking'
import { fetchPool } from 'lib/queries/fetchPool'
import { priceMapAtom } from 'states/system'
import { getBptPrice } from 'utils/getBptPrice'

export function useFetchPool(options: UseFetchOptions = {}) {
  const {
    enabled = true,
    refetchInterval,
    refetchOnWindowFocus = 'always',
    suspense = true,
  } = options
  const { bptAddress } = useStaking()

  const [priceMap, setPriceMap] = useAtom(priceMapAtom)

  // TODO: Multichain 서포트 하려면 queryKeys에 chainId를 인자로 넣어야 할듯
  return useQuery([queryKeys.Pool.Data], () => fetchPool(), {
    enabled,
    staleTime: Infinity,
    refetchInterval,
    refetchOnWindowFocus,
    suspense,
    useErrorBoundary: false,
    select(data) {
      const { totalShares, tokens } = data
      return {
        bptTotalSupply: totalShares,
        poolTokens: tokens,
      }
    },
    onSuccess(data) {
      const bptPrice = getBptPrice(
        data.poolTokens,
        data.bptTotalSupply,
        priceMap
      )

      setPriceMap((prev) => ({
        ...prev,
        [bptAddress]: bptPrice,
      }))
    },
  })
}
