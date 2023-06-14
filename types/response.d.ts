type FiatPrice = {
  usd: number
}

type PriceResponse = { [id: string]: FiatPrice }

type RawPriceMap = { [address: Hash]: string | null }
type PriceMap = { [address: Hash]: string }

type PoolToken = {
  address: Hash
  balance: string
  weight: string
  name: string
  symbol: string
  decimals: number
}

type PoolAction = 'join' | 'exit'

type SerializedPool = {
  address: string
  symbol: stirng
  name: string
  totalShares: string
  totalSwapFee: string
  tokens: PoolToken[]
}

type Pool = {
  bptAddress: Hash
  bptTotalSupply: string
  bptSymbol: string
  bptName: string
  bptDecimals: number

  poolTokens: PoolToken[]
  poolTokenAddresses: Hash[]
  poolTokenBalances: string[]
  poolTokenDecimals: number[]
  poolTokenWeights: string[]
  poolTokenWeightsInPcnt: number[]
  poolTokenSymbols: string[]
  shouldReversePoolTokenOrderOnDisplay: boolean
}

type LiquidityPool = {
  lpToken: {
    address: Hash
    decimals: number
    name: string
    symbol: string
    totalSupply: string
  }

  poolTokens: PoolToken[]

  poolTokenAddresses: Hash[]
  poolTokenBalances: string[]
  poolTokenDecimals: decimals[]
  poolTokenSymbols: string[]
  poolTokenWeights: string[]
  poolTokenWeightsInPcnt: number[]

  poolReserves: string[]

  totalSwapFee: string
  shouldReversePoolTokenOrderOnDisplay: stboodlring
}

type BscStaking = {
  cooldownSeconds: number
  rewardEmissionsPerSec: string[]
  rewardTokenAddresses: Hash[]
  withdrawSeconds: number
  totalStaked: string
}

type EthereumStaking = BscStaking & {
  balancerGaugeAddress: Hash
  balRewardPoolAddress: Hash
  earmarkIncentivePcnt: number
}

type UserDataResponse = {
  cooldownEndsAt: number
  cooldowns: number
  earnedTokenRewards: string[]
  stakedTokenBalance: string
  withdrawEndsAt: number
  hasRewards: boolena
}

type PoolSnapshotResponse = {
  poolTokenBalances: string[]
  totalSwapVolumeIn24Hr: string
  totalSwapFeesIn24Hr: string
}
