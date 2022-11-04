import type { Contract } from 'ethers'
import { parseEther } from 'ethers/lib/utils'
import type { TransactionResponse } from '@ethersproject/providers'

import { sanitizeNumber } from 'utils/num'

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

export async function cooldown(
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
