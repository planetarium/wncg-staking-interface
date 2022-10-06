import {
  BalancerVaultAbi,
  Erc20Abi,
  LiquidityGaugeAbi,
  StakingAbi,
} from 'lib/abi'

function findAbi(abiMap: any, ...args: string[]) {
  const abiList = args.flatMap((fn) => {
    const match = abiMap.find(
      (abi: any) => abi.type === 'function' && abi.name === fn
    )
    if (match) return [match]
    return []
  })
  return abiList
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
