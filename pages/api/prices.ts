import type { NextApiResponse, NextApiRequest } from 'next'
import { coinmarketCapClient } from 'services/coinmarketCapClient'

type ApiPricesReturn = {
  status: Record<string, string>
  data: CoinmarketCapQuoteMap
}

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  try {
    const { data } = await coinmarketCapClient.get<ApiPricesReturn>(
      '/v2/cryptocurrency/quotes/latest?symbol=WNCG,WETH,BAL,ETH,WBTC'
    )

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({
      error: `Unable to fetch fallback prices: ${error}`,
    })
  }
}
