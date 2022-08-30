type TokenConstants = {
  Addresses: {
    nativeAsset: string
    WETH: string
    BAL: string
  }
  PriceChainMap: Record<string, string>
  TokenInfo: {
    [address: string]: TokenInfo
  }
}

type TokenFiatPrice = {
  usd: number
}
type TokenPrices = { [address: string]: string }

type TokenInfo = {
  readonly address: string
  readonly name: string
  readonly decimals: number
  readonly symbol: string
}

type EthType = 'eth' | 'weth'
