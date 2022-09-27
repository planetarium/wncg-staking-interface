import { coingeckoClient } from 'services/coingeckoClient'
import { configService } from 'services/config'
import { convertAddress, uniqAddress } from 'utils/address'
import { createLogger } from 'utils/log'

type PriceResponse = { [id: string]: TokenFiatPrice }

const FIAT_CURRENCY = 'usd'
const NATIVE_ASSET_ID = 'ethereum'
const PLATFORM_ID = 'ethereum'

const logger = createLogger('blue')

export async function fetchNativeAssetPrice(): Promise<TokenPrices> {
  const key = 'Ether price'

  try {
    logger(key)
    const endpoint = `/simple/price?ids=${NATIVE_ASSET_ID}&vs_currencies=${FIAT_CURRENCY}`
    const response = await coingeckoClient.get<PriceResponse>(endpoint)

    return {
      [configService.nativeAssetAddress]:
        response?.[NATIVE_ASSET_ID]?.[FIAT_CURRENCY]?.toString() || '0',
    }
  } catch (error) {
    logger(key, error)
    throw error
  }
}

export async function fetchTokenPrices(
  _addresses: string[] = []
): Promise<TokenPrices> {
  const addresses = uniqAddress(_addresses)
  const tokenAddresses = addresses.map((address) => convertAddress(address))

  const key = `${tokenAddresses.length} token price${
    tokenAddresses.length === 1 ? '' : 's'
  }`

  try {
    const requests: Promise<PriceResponse>[] = []
    tokenAddresses.forEach((address) => {
      const endpoint = `/simple/token_price/${PLATFORM_ID}?contract_addresses=${address}&vs_currencies=${FIAT_CURRENCY}`
      const request = coingeckoClient.get<PriceResponse>(endpoint)
      requests.push(request)
    })

    logger(key)
    const responses = await Promise.all(requests)
    return parsePriceResponses(responses, addresses)
  } catch (error) {
    logger(key, error)
    throw error
  }
}

function parsePriceResponses(
  responses: PriceResponse[],
  addresses: string[]
): TokenPrices {
  const results = responses.reduce(
    (acc, response) => ({
      ...acc,
      ...response,
    }),
    {}
  )

  const prices = Object.values(results)

  const parsedPrices = prices.map((price, i) => [
    addresses[i],
    price?.usd?.toString() || '0',
  ])

  return Object.fromEntries(parsedPrices)
}
