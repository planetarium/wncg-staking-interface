import { Interface } from '@ethersproject/abi'

import {
  BalancerVaultAbi,
  Erc20Abi,
  LiquidityGaugeAbi,
  StakingAbi,
  WETHAbi,
} from 'config/abi'

export const ercTokenIface = new Interface(Erc20Abi)
export const liquidityGaugeIface = new Interface(LiquidityGaugeAbi)
export const stakingIface = new Interface(StakingAbi)
export const vaultIface = new Interface(BalancerVaultAbi)
export const wethIface = new Interface(WETHAbi)
