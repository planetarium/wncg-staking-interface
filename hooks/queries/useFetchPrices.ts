import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'

import { priceMapAtom } from 'states/system'
import config from 'config'
import { queryKeys } from 'config/queryKeys'
import { MINUTE_MS } from 'config/misc'
import { fetchPrices } from 'lib/queries/fetchPrices'
import { bnum } from 'utils/bnum'
import { calcTotalPoolValue } from 'utils/calcTotalPoolValue'
import { useStaking } from 'hooks/useStaking'

export function useFetchPrices(options: UseFetchOptions = {}) {
  const {
    enabled = true,
    refetchInterval = 10 * MINUTE_MS,
    refetchOnWindowFocus = 'always',
    suspense = true,
  } = options
  const queryClient = useQueryClient()
  const {
    bptAddress,
    bptTotalSupply,
    poolTokens,
    rewardTokenAddresses,
    poolTokenAddresses,
  } = useStaking()

  const setPriceMap = useSetAtom(priceMapAtom)

  const initialData = queryClient.getQueryData<PriceMap>(
    [queryKeys.FallbackPrices],
    {
      exact: false,
    }
  )

  return useQuery<PriceMap>(
    [queryKeys.Staking.Prices, config.weth],
    () =>
      fetchPrices(config.weth, ...poolTokenAddresses, ...rewardTokenAddresses),
    {
      enabled,
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchInterval,
      refetchOnWindowFocus,
      useErrorBoundary: false,
      initialData,
      suspense,
      onSuccess(data) {
        if (!data) return

        let bptPrice: string
        try {
          bptPrice =
            bnum(calcTotalPoolValue(poolTokens, data))
              .div(bptTotalSupply)
              .toString() ?? '0'
        } catch {
          bptPrice = '0'
        }

        setPriceMap((prev) => ({ ...prev, ...data, [bptAddress]: bptPrice }))
      },
      onError() {
        const state =
          queryClient.getQueryData<PriceMap>([queryKeys.FallbackPrices], {
            exact: false,
          }) ?? {}

        setPriceMap((prev) => ({ ...prev, ...state }))
      },
    }
  )
}
