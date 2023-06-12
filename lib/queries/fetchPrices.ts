import axios, { AxiosResponse } from 'axios'

import config from 'config'
import { apiKeys, baseUrls } from 'config/api'
import { convertAddress } from 'utils/convertAddress'
import { parseTokenPrices } from 'utils/parseTokenPrices'
import { uniqAddress } from 'utils/uniqAddress'

const FIAT_CURRENCY = 'usd'
const isProd = config.env === 'production'

const client = axios.create({
  baseURL: isProd ? baseUrls.coingeckoPro : baseUrls.coingecko,
  headers: isProd
    ? {
        'x-cg-pro-api-key': apiKeys.coingecko,
      }
    : undefined,
})

async function fetchErcTokenPrices(addresses: Hash[]): Promise<PriceMap> {
  const requests: Promise<AxiosResponse<PriceResponse, any>>[] = []
  const { platformId } = config.nativeCurrency.coingecko

  addresses.forEach((_address) => {
    const address = convertAddress(_address)
    const endpoint = `/simple/token_price/${platformId}?contract_addresses=${address}&vs_currencies=${FIAT_CURRENCY}`
    const request = client.get<PriceResponse>(endpoint)
    requests.push(request)
  })

  const responses = await Promise.all(requests)

  return parseTokenPrices(responses, addresses)
}

async function fetchNativeTokenPrice(): Promise<PriceMap> {
  const { id } = config.nativeCurrency.coingecko
  const endpoint = `/simple/price?ids=${id}&vs_currencies=${FIAT_CURRENCY}`

  const response = await client.get<PriceResponse>(endpoint)

  return {
    [config.nativeCurrency.address]:
      response?.data?.[id]?.[FIAT_CURRENCY]?.toString() ?? '0',
  }
}

export async function fetchPrices(...args: Hash[]): Promise<PriceMap> {
  const addresses = uniqAddress(args)

  try {
    const requests = [fetchNativeTokenPrice(), fetchErcTokenPrices(addresses)]

    const responses = await Promise.all(requests)

    return Object.fromEntries(
      responses.flatMap((response) => Object.entries(response))
    )
  } catch (error) {
    throw error
  }
}
