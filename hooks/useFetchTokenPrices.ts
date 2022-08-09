import { useQuery } from 'react-query'
import { useSetRecoilState } from 'recoil'

import { poolTokenPricesState } from 'app/states/pool'
import { coingecko, tokenIds } from 'lib/coingecko'

export function useFetchTokenPrices() {
  const setPoolTokenPrices = useSetRecoilState(poolTokenPricesState)

  const { data: prices, refetch } = useQuery('tokenPrices', fetchTokenPrices, {
    staleTime: 10 * 1_000,
    onSuccess(data) {
      const { weth, wncg } = data || {}
      setPoolTokenPrices([wncg, weth])
    },
  })

  const { bal, weth, wncg } = prices || {}

  return {
    balPrice: bal || 0,
    wethPrice: weth || 0,
    wncgPrice: wncg || 0,
    fetchTokenPrices: refetch,
  }
}

async function fetchTokenPrices() {
  console.log('> Fetch token prices')
  return await coingecko.getTokens(tokenIds)
}
