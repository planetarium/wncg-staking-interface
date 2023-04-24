import { coingeckoClient } from 'services/coingeckoClient'
import config from 'config'
import { convertAddress } from 'utils/convertAddress'
import { uniqAddress } from 'utils/uniqAddress'

type PriceResponse = { [id: string]: TokenFiatPrice }

const FIAT_CURRENCY = 'usd'
const NATIVE_ASSET_ID = 'ethereum'
const PLATFORM_ID = 'ethereum'

async function fetchErcTokenPrices(
  _addresses: Hash[] = []
): Promise<TokenPrices> {
  const addresses = uniqAddress(_addresses)
  const tokenAddresses = addresses.map((address) => convertAddress(address))
  const requests: Promise<PriceResponse>[] = []

  tokenAddresses.forEach((address) => {
    const endpoint = `/simple/token_price/${PLATFORM_ID}?contract_addresses=${address}&vs_currencies=${FIAT_CURRENCY}`
    const request = coingeckoClient.get<PriceResponse>(endpoint)
    requests.push(request)
  })

  const responses = await Promise.all(requests)
  return parsePriceResponses(responses, addresses)
}

async function fetchNativeAssetPrice(): Promise<TokenPrices> {
  const endpoint = `/simple/price?ids=${NATIVE_ASSET_ID}&vs_currencies=${FIAT_CURRENCY}`
  const response = await coingeckoClient.get<PriceResponse>(endpoint)

  return {
    [config.nativeCurrency.address]:
      response?.[NATIVE_ASSET_ID]?.[FIAT_CURRENCY]?.toString() || '0',
  }
}

export async function fetchTokenPrices(addresses: Hash[]) {
  try {
    const requests = [fetchErcTokenPrices(addresses), fetchNativeAssetPrice()]
    const responses = await Promise.all(requests)
    return Object.fromEntries(
      responses.flatMap((response) => Object.entries(response))
    )
  } catch (error) {
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
