import { Interface } from '@ethersproject/abi'

import {
  BalancerLiquidityGaugeAbi,
  BalancerRewardPoolAbi,
  BalancerVaultAbi,
  Erc20Abi,
  Multicall3Abi,
  PancakePairAbi,
  PancakeRouterAbi,
  StakingBscAbi,
  StakingEthereumAbi,
  WETHAbi,
} from 'config/abi'

export const balRewardPoolIface = new Interface(BalancerRewardPoolAbi)
export const ercTokenIface = new Interface(Erc20Abi)
export const liquidityGaugeIface = new Interface(BalancerLiquidityGaugeAbi)
export const multicall3 = new Interface(Multicall3Abi)
export const pancakePairIface = new Interface(PancakePairAbi)
export const pancakeRouterIface = new Interface(PancakeRouterAbi)
export const stakingBscIface = new Interface(StakingBscAbi)
export const stakingEthereumIface = new Interface(StakingEthereumAbi)
export const vaultIface = new Interface(BalancerVaultAbi)
export const wethIface = new Interface(WETHAbi)
