import { useCallback, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { rewardTokensListAtom } from 'states/staking'
import { TOKEN_PRICES_PLACEHOLDERS } from 'constants/tokens'
import { configService } from 'services/config'
import { fetchTokenPrices } from 'lib/coingecko'
import { fetchCoinmarketCapTokenPrice } from 'lib/coinmarketCap'
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

  const { bptAddress, poolTokenAddresses, poolTokens, poolTotalShares } =
    usePool()

  const rewardTokensList = useAtomValue(rewardTokensListAtom)

  const addresses = useMemo(
    () =>
      uniqAddress([
        ...poolTokenAddresses,
        ...rewardTokensList,
        configService.bal,
      ]),
    [poolTokenAddresses, rewardTokensList]
  )

  const fallbackTokenPrices = useQuery(
    ['fallbackTokenPrices'],
    fetchCoinmarketCapTokenPrice,
    {
      retry: false,
      staleTime: Infinity,
      keepPreviousData: true,
      placeholderData: TOKEN_PRICES_PLACEHOLDERS,
    }
  )

  const tokenPrices = useQuery<TokenPrices>(
    ['tokenPrices', addresses],
    () => fetchTokenPrices(addresses),
    {
      ...options,
      onError() {
        const state =
          queryClient.getQueryData<TokenPrices>(['fallbackTokenPrices']) ||
          TOKEN_PRICES_PLACEHOLDERS
        queryClient.setQueryData(['tokenPrices', addresses], state)
      },
    }
  )

  const bptPrice = useMemo(() => {
    if (!tokenPrices.data) return '0'
    return bnum(calcPoolTotalValue(poolTokens, tokenPrices.data))
      .div(poolTotalShares)
      .toString()
  }, [poolTokens, poolTotalShares, tokenPrices.data])

  const priceMap = useMemo(() => {
    const map = tokenPrices.data ?? {}
    if (!bptAddress) return map
    return {
      ...map,
      [bptAddress]: bptPrice,
    }
  }, [bptAddress, bptPrice, tokenPrices.data])

  const priceFor = useCallback(
    (address = '') => priceMap[address.toLowerCase()] || '0',
    [priceMap]
  )

  const invalidPriceError = useMemo(
    () => fallbackTokenPrices.isError && tokenPrices.isError,
    [fallbackTokenPrices.isError, tokenPrices.isError]
  )

  return {
    bptPrice,
    priceFor,
    invalidPriceError,
  }
}
