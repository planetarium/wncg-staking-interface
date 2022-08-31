import { BigNumberish, constants, Contract } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import type {
  TransactionResponse,
  Web3Provider,
} from '@ethersproject/providers'

import { configService } from 'services/config'
import { uniqAddress } from 'utils/address'
import { aggregateCall } from 'utils/contract'
import { createLogger } from 'utils/log'
import { bnum } from 'utils/num'
import { getTokenInfo } from 'utils/token'

export type AllowanceMap = {
  [address: string]: boolean
}

export type AllowancesMap = {
  [spender: string]: AllowanceMap
}

export type BalanceMap = {
  [address: string]: string
}

const logger = createLogger('orange')

export async function fetchAllowances(
  provider: Web3Provider | null,
  account: string | null,
  _addresses: string[] = [],
  _spenders: string[] = []
): Promise<AllowancesMap> {
  if (!provider || !account) return {}

  const addresses = uniqAddress(_addresses)
  const spenders = uniqAddress(_spenders)
  const key = `${addresses.length} allowances on ${spenders.length} contracts`

  const signer = provider.getSigner(account)

  try {
    logger(key)
    const requests = spenders.map((spender) =>
      aggregateCall<BigNumberish>(
        signer,
        addresses,
        'allowance',
        account,
        spender
      )
    )

    const allowances = await Promise.all(requests)
    return associateAllowances(allowances, addresses, spenders)
  } catch (error) {
    logger(key, error, addresses)
    throw error
  }
}

export async function fetchNativeAssetBalance(
  provider: Web3Provider,
  account: string
): Promise<string> {
  const key = 'ether balance'
  try {
    logger(key)
    const balance = await provider.getBalance(account)
    return balance
      ? formatUnits(balance.toString(), configService.nativeAsset.decimals)
      : '0'
  } catch (error) {
    logger(key, error)
    throw error
  }
}

export async function fetchBalances(
  provider: Web3Provider | null,
  account: string | null,
  _addresses: string[] = []
): Promise<BalanceMap> {
  const addresses = uniqAddress(_addresses)
  if (!provider || !account || !addresses.length) return {}

  const key = `${addresses.length} balances`
  const signer = provider.getSigner(account)

  try {
    logger(key)
    const nativeAssetBalance = await fetchNativeAssetBalance(provider, account)
    const balances = await aggregateCall<BigNumberish>(
      signer,
      addresses,
      'balanceOf',
      account
    )
    return {
      ...associateBalances(balances, addresses),
      [configService.nativeAssetAddress]: nativeAssetBalance,
    }
  } catch (error) {
    logger(key, error)
    throw error
  }
}

export async function approve(
  contract: Contract,
  spender: string
): Promise<TransactionResponse> {
  return await contract.approve(spender, constants.MaxUint256)
}

function associateAllowances(
  allowances: BigNumberish[][],
  addresses: string[],
  spenders: string[]
): AllowancesMap {
  const allowanceEntries = allowances.map((allowance) => {
    return allowance.map((amount, i) => {
      const address = addresses[i].toLowerCase()
      const isApproved = bnum(amount.toString()).gt(0)
      return [address, isApproved]
    })
  })
  const allowanceMap = allowanceEntries.map((entries) =>
    Object.fromEntries(entries)
  )
  const entries = spenders.map((spender, i) => [
    spender.toLowerCase(),
    allowanceMap[i],
  ])
  return Object.fromEntries(entries)
}

function associateBalances(
  balances: BigNumberish[],
  addresses: string[]
): BalanceMap {
  const entries = balances.map((balance, i) => {
    const address = addresses[i].toLowerCase()
    const decimals = getTokenInfo(address).decimals
    const amount = formatUnits(balance.toString(), decimals)
    return [address, amount]
  })
  return Object.fromEntries(entries)
}
