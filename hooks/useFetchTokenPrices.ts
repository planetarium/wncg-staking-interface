import { useQuery } from 'react-query'
import { useSetRecoilState } from 'recoil'

import { priceErrorState } from 'app/states/error'
import { poolTokenPricesState } from 'app/states/pool'
import { coingecko, tokenIds, tokenSymbols } from 'services/coingecko'

type PriceMap = Record<string, number>

const DEFAULT_TOKEN_PRICES = tokenSymbols.reduce((acc, symb) => {
  acc[symb] = 0
  return acc
}, {} as PriceMap)

export function useFetchTokenPrices() {
  const setPoolTokenPrices = useSetRecoilState(poolTokenPricesState)
  const setPriceError = useSetRecoilState(priceErrorState)

  const { data: prices, refetch } = useQuery('tokenPrices', fetchTokenPrices, {
    staleTime: 10 * 1_000,
    keepPreviousData: true,
    retry: false,
    placeholderData: DEFAULT_TOKEN_PRICES,
    onError() {
      setPoolTokenPrices([0, 0])
      setPriceError(true)
    },
    onSuccess(data) {
      const { weth, wncg } = data || {}
      setPoolTokenPrices([wncg, weth])
      setPriceError(false)
    },
  })

  const { bal, weth, wncg } = prices || DEFAULT_TOKEN_PRICES

  return {
    balPrice: bal,
    wethPrice: weth,
    wncgPrice: wncg,
    fetchTokenPrices: refetch,
  }
}

async function fetchTokenPrices(): Promise<PriceMap> {
  console.log('> Fetch token prices')
  return await coingecko.getTokenPrices(tokenIds)
}
