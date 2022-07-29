type Pool = {
  id: string
  address: string
  createTime: number
  factory: string
  symbol: stirng
  name: string
  swapFee: string
  owner: string
  totalLiquidity: string
  totalShares: string
  totalSwapFee: string
  totalSwapVolume: string
  tokens: PoolToken[]
  tokensList: string[]
}

type PoolToken = {
  address: string
  balance: string
  weight: string
  name: string
  symbol: string
  decimals: number
}

type PoolAction = 'join' | 'exit'
