import type { AxiosResponse } from 'axios'

import { convertAddress } from './convertAddress'

export function parseTokenPrices(
  responses: AxiosResponse<PriceResponse, any>[],
  addresses: Hash[]
): PriceMap {
  const prices = responses.map((res) => res.data)

  const parsedPrices: [Hash, string][] = prices.map((price, i) => {
    const tokenAddress = addresses[i]
    const _address = convertAddress(tokenAddress)
    return [tokenAddress, price[_address]?.usd?.toString() ?? '0']
  })

  return Object.fromEntries(parsedPrices)
}
