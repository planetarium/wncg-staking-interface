type CoinmarketCapPrice = {
  USD: {
    price: string
  }
}

type CoinmarketCapQuote = {
  id: number
  name: string
  symbol: string
  slug: string
  num_market_pairs: number
  platform: {
    id: number
    name: string
    slug: string
    symbol: string
    token_address: string
  }
  date_added: string
  tags: [Array]
  max_supply: null
  circulating_supply: number
  total_supply: number
  is_active: number
  cmc_rank: number
  is_fiat: number
  last_updated: string
  quote: CoinmarketCapPrice
}

type CoinmarketCapQuoteMap = Record<string, CoinmarketCapQuote[]>
