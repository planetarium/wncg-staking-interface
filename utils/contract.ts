import type { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'

import type { AllowanceMap, AllowancesMap, BalanceMap } from 'states/user'
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
