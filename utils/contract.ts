import type { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'

import type { AllowanceMap, AllowancesMap, BalanceMap } from 'states/user'
import { configService } from 'services/config'
import { uniqAddress } from 'utils/address'
import { bnum } from 'utils/num'
import { getTokenInfo } from './token'

export function associateAllowances(
  tokenAddresses: string[],
  spenders: string[],
  _allowances: BigNumber[]
): AllowancesMap {
  const allowances = _allowances.map((allowance) => allowance?.gt(0) || false)

  const entries = tokenAddresses.map((address, i) => {
    const tokenAllowances = allowances.slice(
      i * spenders.length,
      (i + 1) * spenders.length
    )
    const tokenAllowanceMap: AllowanceMap = Object.fromEntries(
      tokenAllowances.map((allowance, i) => [
        spenders[i].toLowerCase(),
        allowance,
      ])
    )
    return [address.toLowerCase(), tokenAllowanceMap]
  })

  return Object.fromEntries(entries)
}

export function associateBalances(
  balances: BigNumber[],
  addresses: string[]
): BalanceMap {
  const entries = balances.map((balance, i) => {
    const address = addresses[i].toLowerCase()
    const decimals = getTokenInfo(address).decimals
    const amount = formatUnits(balance?.toString() || '0', decimals)
    return [address, amount]
  })

  return Object.fromEntries(entries)
}

export function associateStakingContractData(data?: unknown[]) {
  if (!data) return null

  const [
    earmarkIncentiveFee,
    feeDenominator,
    balancerGauge,
    rewardToken,
    stakedToken,
    balEmissionPerSec,
    wncgEmissionPerSec,
    cooldownSeconds,
    unstakeWindow,
  ] = data as [
    BigNumber,
    BigNumber,
    string,
    string,
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber
  ]

  const earmarkIncentivePcnt = Math.min(
    bnum(earmarkIncentiveFee?.toNumber() ?? 0)
      .div(feeDenominator?.toNumber() ?? 0)
      .toNumber() ?? 0.01,
    1
  )

  const emissions = [wncgEmissionPerSec, balEmissionPerSec].map((emission) =>
    formatUnits(emission?.toString() ?? 0)
  )

  const liquidityGaugeAddress = balancerGauge ?? ''

  const rewardTokenAddress = rewardToken?.toLowerCase() ?? ''

  const rewardTokensList = uniqAddress([rewardTokenAddress, configService.bal])

  const rewardTokenDecimals = rewardTokensList.map(
    (address) => getTokenInfo(address).decimals
  )

  const rewardTokenSymbols = rewardTokensList.map(
    (address) => getTokenInfo(address).symbol
  )

  const stakedTokenAddress = stakedToken?.toLowerCase() ?? ''

  const cooldownWindowPeriod = cooldownSeconds?.toNumber() ?? 0

  const withdrawWindowPeriod = unstakeWindow?.toNumber() ?? 0

  const result = {
    earmarkIncentivePcnt,
    emissions,
    liquidityGaugeAddress,
    rewardTokenAddress,
    rewardTokensList,
    rewardTokenDecimals,
    rewardTokenSymbols,
    stakedTokenAddress,
    cooldownWindowPeriod,
    withdrawWindowPeriod,
  }

  return result
}
