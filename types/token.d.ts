type TokenConstants = {
  Addresses: {
    nativeAsset: string
    WETH: string
    BAL: string
  }
  PriceChainMap: Record<string, string>
  TokenInfo: {
    [address: Hash]: TokenInfo
  }
}

type TokenFiatPrice = {
  usd: number
}

type TokenPrices = { [address: Hash]: string }

type TokenInfo = {
  readonly address: Hash
  readonly name: string
  readonly decimals: number
  readonly symbol: string
}

type TokenMap = {
  [address: Hash]: TokenInfo
}
