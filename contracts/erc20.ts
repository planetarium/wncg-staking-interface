import { constants, Contract } from 'ethers'
import type { TransactionResponse } from '@ethersproject/providers'

export async function approve(
  contract: Contract,
  spender: string
): Promise<TransactionResponse> {
  return await contract.approve(spender, constants.MaxUint256)
}
