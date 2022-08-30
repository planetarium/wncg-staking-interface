import { useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSetRecoilState } from 'recoil'

import { invalidPriceState } from 'app/states/error'
import { fetchNativeAssetPrice, fetchTokenPrices } from 'services/price'
import { configService } from 'services/config'
import { TOKEN_PRICES_PLACEHOLDERS } from 'constants/tokens'
import { usePoolService } from './usePoolService'

export function useTokenPrices() {
  const setInvalidPrice = useSetRecoilState(invalidPriceState)

  const { bptAddress, poolService, poolTokenAddresses } = usePoolService()

  const addresses = [...poolTokenAddresses, configService.bal]

  const { data: prices } = useQuery<TokenPrices>(
    ['tokenPrices', addresses],
    () => fetchTokenPrices(addresses),
    {
      // retry: 3,
      placeholderData: TOKEN_PRICES_PLACEHOLDERS,
      staleTime: 10 * 1_000,
      onError() {
        setInvalidPrice(true)
      },
    }
  )

  const { data: nativeAssetPrice } = useQuery(
    ['nativeAssetPrice'],
    () => fetchNativeAssetPrice(),
    {
      staleTime: 10 * 1_000,
    }
  )

  const bptPrice = useMemo(
    () => poolService?.bptPrice(prices) || '0',
    [poolService, prices]
  )

  const priceMap = useMemo(() => {
    const map = { ...prices, ...nativeAssetPrice } || {}
    if (!bptAddress) return map
    return {
      ...map,
      [bptAddress]: bptPrice,
    }
  }, [bptAddress, bptPrice, nativeAssetPrice, prices])

  const priceFor = useCallback(
    (address = '') => {
      return priceMap[address.toLowerCase()] || '0'
    },
    [priceMap]
  )

  const balPrice = useMemo(() => priceFor(configService.bal), [priceFor])
  const wncgPrice = useMemo(
    () => priceFor(poolTokenAddresses[0]),
    [poolTokenAddresses, priceFor]
  )

  return {
    balPrice,
    bptPrice,
    wncgPrice,
    priceFor,
  }
}
