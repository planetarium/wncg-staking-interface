import { ChainId } from 'config/chains'
import type { ChainMap } from 'config/types'

export const LIQUIDITY_POOL_PLACEHOLDER = {
  lpToken: {
    address: '0x',
    decimals: 18,
    name: '',
    symbol: '',
    totalSupply: '0',
  },

  poolTokens: [],
  poolTokenAddresses: [],
  poolTokenBalances: [],
  poolTokenDecimals: [],
  poolTokenWeights: [],
  poolTokenWeightsInPcnt: [],
  poolTokenSymbols: [],

  totalSwapFee: '0',
  shouldReversePoolTokenOrderOnDisplay: true,
} satisfies LiquidityPool

const BSC_STAKING_PLACEHOLDER = {
  cooldownSeconds: 0,
  rewardEmissionsPerSec: [],
  rewardTokenAddresses: [],
  totalStaked: '0',
  withdrawSeconds: 0,
} satisfies BscStaking

const ETHEREUM_STAKING_PLACEHOLDER = {
  ...BSC_STAKING_PLACEHOLDER,
  balancerGaugeAddress: '' as Hash,
  balRewardPoolAddress: '' as Hash,
  earmarkIncentivePcnt: 0.01,
} satisfies EthereumStaking

export const STAKING_PLACEHOLDER: ChainMap<BscStaking | EthereumStaking> = {
  [ChainId.ETHEREUM]: ETHEREUM_STAKING_PLACEHOLDER,
  [ChainId.GOERLI]: ETHEREUM_STAKING_PLACEHOLDER,
  [ChainId.BSC]: BSC_STAKING_PLACEHOLDER,
  [ChainId.BSC_TESTNET]: BSC_STAKING_PLACEHOLDER,
}
