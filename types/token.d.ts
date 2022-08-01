type TokenInfo = {
  readonly address: string
  readonly name: string
  readonly decimals: number
  readonly symbol: string
}

type TokenFiatPrice = {
  usd: number
}

type TokenPrice = Record<string, TokenFiatPrice>

type EthType = 'eth' | 'weth'
