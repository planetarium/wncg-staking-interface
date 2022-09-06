import { useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSetRecoilState } from 'recoil'

import { invalidPriceState } from 'app/states/error'
import { TOKEN_PRICES_PLACEHOLDERS } from 'constants/tokens'
import { configService } from 'services/config'
import { fetchNativeAssetPrice, fetchTokenPrices } from 'services/price'
import { usePool } from './usePool'

const options = {
  staleTime: (60 - 10) * 1_000,
  refetchInterval: 60 * 1_000,
  keepPreviousData: true,
}

export function usePrices() {
  const setInvalidPrice = useSetRecoilState(invalidPriceState)

  const { bptAddress, poolService, poolTokenAddresses } = usePool()

  const addresses = [
    ...poolTokenAddresses,
    ...configService.rewardTokensList,
    configService.bal,
  ]

  const { data: prices } = useQuery<TokenPrices>(
    ['tokenPrices', addresses],
    () => fetchTokenPrices(addresses),
    {
      ...options,
      placeholderData: TOKEN_PRICES_PLACEHOLDERS,
      onError() {
        setInvalidPrice(true)
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
