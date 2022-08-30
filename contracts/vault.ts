import type { BigNumberish, Contract } from 'ethers'
import type { TransactionResponse } from '@ethersproject/providers'
import { WeightedPoolEncoder } from '@balancer-labs/sdk'

type InitJoinPoolParams = {
  amounts: string[]
  assets: string[]
  isNativeAsset: boolean
  minBptOut: string
  nativeAssetIndex: number
  poolId: string
  joinInit?: boolean
}

export async function initJoinPool(
  contract: Contract,
  account: string,
  params: InitJoinPoolParams
): Promise<TransactionResponse> {
  const {
    poolId,
    amounts,
    assets,
    isNativeAsset,
    minBptOut,
    nativeAssetIndex,
    joinInit = false,
  } = params

  const request = buildJoin({
    assets,
    maxAmountsIn: amounts,
    minBptOut,
    joinInit,
  })

  return isNativeAsset
    ? await contract.joinPool(poolId, account, account, request, {
        value: amounts[nativeAssetIndex],
      })
    : await contract.joinPool(poolId, account, account, request)
}

type BuildJoinParams = {
  assets: string[]
  maxAmountsIn: BigNumberish[]
  minBptOut: string
  joinInit?: boolean
}

function buildJoin({
  assets,
  maxAmountsIn,
  minBptOut,
  joinInit = false,
}: BuildJoinParams) {
  const userData = joinInit
    ? WeightedPoolEncoder.joinInit(maxAmountsIn)
    : WeightedPoolEncoder.joinExactTokensInForBPTOut(maxAmountsIn, minBptOut)

  const request = {
    assets,
    maxAmountsIn,
    userData,
    fromInternalBalance: false,
  }

  return request
}
