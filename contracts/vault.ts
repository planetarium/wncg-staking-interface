import type { Contract } from 'ethers'
import type { TransactionResponse } from '@ethersproject/providers'

import { buildJoin, buildPropExit, buildSingleExit } from 'utils/joinExit'

type JoinPoolParams = {
  amounts: string[]
  assets: string[]
  isNativeAsset: boolean
  minBptOut: string
  nativeAssetIndex: number
  poolId: string
  joinInit?: boolean
}

export async function joinPool(
  contract: Contract,
  account: string,
  params: JoinPoolParams
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

type ExitPoolParams = {
  amounts: string[]
  assets: string[]
  bptIn: string
  exactOut: boolean
  isProportional: boolean
  poolId: string
  tokenOutIndex: number
}

export async function exitPool(
  contract: Contract,
  account: string,
  params: ExitPoolParams
): Promise<TransactionResponse> {
  const {
    amounts,
    assets,
    bptIn,
    exactOut,
    isProportional,
    poolId,
    tokenOutIndex,
  } = params

  const request = isProportional
    ? buildPropExit({
        assets,
        bptIn,
      })
    : buildSingleExit({
        assets,
        bptIn,
        minAmountsOut: amounts,
        tokenOutIndex,
        exactOut,
      })

  return await contract.exitPool(poolId, account, account, request)
}
