import { useCallback, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtomValue, useSetAtom } from 'jotai'

import { invalidPriceAtom } from 'states/error'
import { rewardTokensListAtom } from 'states/staking'
import { TOKEN_PRICES_PLACEHOLDERS } from 'constants/tokens'
import { configService } from 'services/config'
import { fetchNativeAssetPrice, fetchTokenPrices } from 'lib/coingecko'
import { uniqAddress } from 'utils/address'
import { calcPoolTotalValue } from 'utils/calculator'
import { bnum } from 'utils/num'
import { usePool } from './usePool'

const options = {
  retry: false,
  staleTime: 60 * 1_000,
  keepPreviousData: true,
}

export function usePrices() {
  const queryClient = useQueryClient()

  const {
    bptAddress,
    ercTokenIndex,
    poolTokenAddresses,
    poolTokens,
    poolTotalShares,
  } = usePool()

  const rewardTokensList = useAtomValue(rewardTokensListAtom)
  const setInvalidPrice = useSetAtom(invalidPriceAtom)

  const addresses = useMemo(
    () =>
      uniqAddress([
        ...poolTokenAddresses,
        ...rewardTokensList,
        configService.bal,
      ]),
    [poolTokenAddresses, rewardTokensList]
  )

  const { data: prices } = useQuery<TokenPrices>(
    ['tokenPrices', addresses],
    () => fetchTokenPrices(addresses),
    {
      ...options,
      placeholderData: TOKEN_PRICES_PLACEHOLDERS,
      onError() {
        const state = queryClient.getQueryData<TokenPrices>([
          'fallbackTokenPrices',
        ])
        queryClient.setQueryData(
          ['tokenPrices', addresses],
          state || TOKEN_PRICES_PLACEHOLDERS
        )
      },
      onSuccess() {
        setInvalidPrice(false)
      },
    }
  )

  const { data: nativeAssetPrice } = useQuery(
    ['nativeAssetPrice'],
    () => fetchNativeAssetPrice(),
    {
      ...options,
      placeholderData: {},
    }
  )

  const bptPrice = useMemo(() => {
    if (!prices) return '0'
    return bnum(calcPoolTotalValue(poolTokens, prices))
      .div(poolTotalShares)
      .toString()
  }, [poolTokens, poolTotalShares, prices])

  const priceMap = useMemo(() => {
    const map = { ...prices, ...nativeAssetPrice } || {}
    if (!bptAddress) return map
    return {
      ...map,
      [bptAddress]: bptPrice,
    }
  }, [bptAddress, bptPrice, nativeAssetPrice, prices])

  const priceFor = useCallback(
    (address = '') => priceMap[address.toLowerCase()] || '0',
    [priceMap]
  )

  const balPrice = useMemo(() => priceFor(configService.bal), [priceFor])
  const wncgPrice = useMemo(
    () => priceFor(poolTokenAddresses[ercTokenIndex]),
    [ercTokenIndex, poolTokenAddresses, priceFor]
  )

  return {
    balPrice,
    bptPrice,
    wncgPrice,
    priceFor,
  }
}
