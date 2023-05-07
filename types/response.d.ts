type FiatPrice = {
  usd: number
}

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

type Pool = {
  bptAddress: Hash
  bptTotalSupply: string
  bptSymbol: string
  bptName: string
  bptDecimals: number
  poolId: string
  poolSwapFee: string
  poolTotalLiquidity: string
  poolTotalSwapVolume: string
  poolTotalSwapFee: string
  poolTokens: PoolToken[]
  poolTokenAddresses: Hash[]
  poolTokenBalances: string[]
  poolTokenDecimals: number[]
  poolTokenWeights: string[]
  poolTokenWeightsInPcnt: number[]
  poolTokenSymbols: string[]
}

type UnserializedStakingResponse = [
  BigNumber,
  BigNumber,
  Hash,
  Hash,
  Hash,
  Hash,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber
]

type PriceResponse = { [id: string]: FiatPrice }

type PoolResponse = {
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

type StakingResponse = {
  cooldownPeriod: number
  earmarkIncentivePcnt: number
  balRewardPoolAddress: Hash
  liquidityGaugeAddress: Hash
  rewardEmissions: string[]
  rewardTokenAddress: Hash
  rewardTokenAddresses: Hash[]
  stakedTokenAddress: Hash
  unstakePeriod: number
  totalStaked: string
}

type BuildResponse = {
  tokenMap: TokenMap
  pool: PoolResponse
} & Pool &
  StakingResponse

type UserDataResponse = {
  cooldownEndsAt: number
  cooldowns: number
  earnedRewards: string[]
  stakedTokenBalance: string
  withdrawEndsAt: number
  hasRewards: boolena
}

type PoolSnapshotResponse = {
  poolTokenBalances: string[]
  totalSwapVolumeIn24Hr: string
  totalSwapFeesIn24Hr: string
}
