import type { Contract } from 'ethers'
import { formatEther, formatUnits, parseEther } from 'ethers/lib/utils'
import type { TransactionResponse } from '@ethersproject/providers'
import { isPast } from 'date-fns'

import { createLogger } from 'utils/log'
import { sanitizeNumber } from 'utils/num'

type Account = string | null

const logger = createLogger('white')

const unstakeLogger = createLogger('black')

//   NOTE: BAL reward contract address
export async function getBalancerGaugeAddress(
  contract: Contract
): Promise<string> {
  const key = 'balancer gauge address'

  try {
    logger(key)
    return await contract.balancerGauge()
  } catch (error) {
    logger(key, error)
    throw error
  }
}

export async function getEarnedBal(
  contract: Contract,
  account: Account,
  decimals: number
) {
  if (!account) return '0'
  const key = 'earned BAL'

  try {
    logger(key)
    const data = await contract.earnedBAL(account)
    return data ? formatUnits(data, decimals) : '0'
  } catch (error) {
    logger(key, error)
    throw error
  }
}

export async function getEarnedWncg(
  contract: Contract,
  account: Account,
  decimals: number
) {
  if (!account) return '0'
  const key = 'earned wNCG'

  try {
    logger(key)
    const data = await contract.earnedWNCG(account)
    return data ? formatUnits(data, decimals) : '0'
  } catch (error) {
    logger(key, error)
    throw error
  }
}

export async function getBalEmissionPerSec(contract: Contract) {
  const key = 'BAL emission/s'

  try {
    logger(key)
    const data = await contract.getBALRewardRate()
    return data ? formatEther(data) : '0'
  } catch (error) {
    logger(key, error)
    throw error
  }
}

export async function getWncgEmissionPerSec(contract: Contract) {
  const key = 'wNCG emission/s'

  try {
    logger(key)
    const data = await contract.getWNCGEmissionPerSec()
    return data ? formatEther(data) : '0'
  } catch (error) {
    logger(key, error)
    throw error
  }
}

export async function getStakedTokenBalance(
  contract: Contract,
  account: Account
) {
  if (!account) return '0'
  const key = 'staked token balance'

  try {
    logger(key)
    const data = await contract.stakedTokenBalance(account)
    return data ? formatEther(data) : '0'
  } catch (error) {
    logger(key, error)
    throw error
  }
}

export async function getTotalStaked(contract: Contract) {
  const key = 'total staked amount'

  try {
    logger(key)
    const data = await contract.totalStaked()
    return data ? formatEther(data) : '0'
  } catch (error) {
    logger(key, error)
    throw error
  }
}

export async function getUnstakeWindow(contract: Contract): Promise<number> {
  const key = 'unstake window'

  try {
    unstakeLogger(key)
    const data = await contract.UNSTAKE_WINDOW()
    return data ? data.toNumber() : 0
  } catch (error) {
    unstakeLogger(key, error)
    throw error
  }
}

export async function getEarmarkIncentiveFee(
  contract: Contract
): Promise<number> {
  const key = 'earmark incentive fee'

  try {
    logger(key)
    const data = await contract.earmarkIncentive()
    return data ? data.toNumber() : 0
  } catch (error) {
    logger(key, error)
    throw error
  }
}

export async function getFeeDenominator(contract: Contract): Promise<number> {
  const key = 'fee denominator'

  try {
    logger(key)
    const data = await contract.FEE_DENOMINATOR()
    return data ? data.toNumber() : 0
  } catch (error) {
    logger(key, error)
    throw error
  }
}

export async function getCooldownEndTimestamp(
  contract: Contract,
  account: Account
) {
  if (!account) return 0

  unstakeLogger('cooldown end timestamp')
  const data = await contract.getCooldownEndTimestamp(account)
  let timestamp = data ? data.toNumber() * 1_000 : 0
  if (isPast(timestamp)) timestamp = 0

  return timestamp
}

export async function getWithdrawEndTimestamp(
  contract: Contract,
  account: Account
) {
  if (!account) return 0
  unstakeLogger('withdraw end timestamp')
  const data = await contract.getWithdrawEndTimestamp(account)
  let timestamp = data ? data.toNumber() * 1_000 : 0
  if (isPast(timestamp)) timestamp = 0

  return timestamp
}

export async function claimAllRewards(
  contract: Contract
): Promise<TransactionResponse> {
  return await contract.claimAllRewards()
}

export async function claimBalRewards(
  contract: Contract
): Promise<TransactionResponse> {
  return await contract.claimBALRewards()
}

export async function claimWncgRewards(
  contract: Contract,
  amount: string
): Promise<TransactionResponse> {
  return await contract.claimWNCGRewards(amount)
}

export async function earmarkRewards(
  contract: Contract
): Promise<TransactionResponse> {
  return await contract.earmarkRewards()
}

export async function stakeBpt(
  contract: Contract,
  amount: string
): Promise<TransactionResponse> {
  return await contract.stake(parseEther(sanitizeNumber(amount)).toString())
}

export async function initCooldown(
  contract: Contract
): Promise<TransactionResponse> {
  return await contract.cooldown()
}

export async function unstakeBpt(
  contract: Contract,
  amount: string,
  isClaimAllRewards?: boolean
): Promise<TransactionResponse> {
  return await contract.withdraw(
    parseEther(sanitizeNumber(amount)),
    isClaimAllRewards
  )
}
