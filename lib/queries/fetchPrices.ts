import axios, { AxiosResponse } from 'axios'

import { apiKeys, baseUrls } from 'config/api'
import { CHAINS } from 'config/chains'
import { getPricingAsset } from 'utils/getPricingAsset'
import { platformIdFor } from 'utils/platformIdFor'

const FIAT_CURRENCY = 'usd'

const coingeckoClient = axios.create({
  baseURL: baseUrls.coingeckoPro,
  headers: {
    'x-cg-pro-api-key': apiKeys.coingecko,
  },
})

async function fetchErcTokenPrices(
  chainId: ChainId,
  addresses: Hash[]
): Promise<PriceMap> {
  const requests: Promise<AxiosResponse<PriceResponse, any>>[] = []
  const platformId = platformIdFor(chainId)

  addresses.forEach((addr) => {
    const asset = getPricingAsset(chainId, addr)
    const endpoint = `/simple/token_price/${platformId}?contract_addresses=${asset}&vs_currencies=${FIAT_CURRENCY}`
    const request = coingeckoClient.get<PriceResponse>(endpoint)

    requests.push(request)
  })

  try {
    const responses = await Promise.all(requests)

    const priceDataList: [Hash, string][] = responses
      .map((r) => r.data)
      .map((price, i) => {
        const address = addresses[i]
        const pricingAsset = getPricingAsset(chainId, address)

        return [address, price[pricingAsset]?.usd?.toString() ?? '0']
      })

    return Object.fromEntries(priceDataList)
  } catch (error: any) {
    throw error
  }
}

async function fetchNativeTokenPrice(chainId: ChainId): Promise<PriceMap> {
  const { nativeCurrency } = CHAINS[chainId]
  const { address, coingeckoId } = nativeCurrency

  const endpoint = `/simple/price?ids=${coingeckoId}&vs_currencies=${FIAT_CURRENCY}`

  const response = await coingeckoClient.get<PriceResponse>(endpoint)

  return {
    [address.toLowerCase()]:
      response?.data?.[coingeckoId]?.[FIAT_CURRENCY]?.toString() ?? '0',
  }
}

export async function fetchPrices(
  chainId: ChainId,
  addresses: Hash[]
): Promise<PriceMap> {
  try {
    const requests = [
      fetchNativeTokenPrice(chainId),
      fetchErcTokenPrices(chainId, addresses),
    ]
    const responses = await Promise.all(requests)

    return Object.fromEntries(
      responses.flatMap((response) => Object.entries(response))
    )
  } catch (error) {
    throw error
  }
}
