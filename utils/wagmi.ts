import {
  BalancerVaultAbi,
  Erc20Abi,
  LiquidityGaugeAbi,
  StakingAbi,
} from 'lib/abi'

function findAbi(abiMap: any, ...args: string[]) {
  return args.flatMap((fn) =>
    abiMap.filter((abi: any) => abi.type === 'function' && abi.name === fn)
  )
}

export function findAbiFromBalancerVault(...args: string[]) {
  return findAbi(BalancerVaultAbi, ...args)
}

export function findAbiFromErc20(...args: string[]) {
  return findAbi(Erc20Abi, ...args)
}

export function findAbiFromLiquidityGauge(...args: string[]) {
  return findAbi(LiquidityGaugeAbi, ...args)
}

export function findAbiFromStaking(...args: string[]) {
  return findAbi(StakingAbi, ...args)
}
