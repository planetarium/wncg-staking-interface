import type { BigNumberish } from 'ethers'
import { WeightedPoolEncoder } from '@balancer-labs/sdk'

type BuildJoinParams = {
  assets: string[]
  maxAmountsIn: BigNumberish[]
  minBptOut: string
  joinInit?: boolean
}

export function buildJoin({
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

type BuildSingleExitParams = {
  assets: string[]
  bptIn: string
  exactOut: boolean
  minAmountsOut: string[]
  tokenOutIndex: number
}

export function buildSingleExit({
  assets,
  bptIn,
  exactOut,
  minAmountsOut,
  tokenOutIndex,
}: BuildSingleExitParams) {
  const userData = exactOut
    ? WeightedPoolEncoder.exitBPTInForExactTokensOut(minAmountsOut, bptIn)
    : WeightedPoolEncoder.exitExactBPTInForOneTokenOut(bptIn, tokenOutIndex)

  const request = {
    assets,
    minAmountsOut,
    userData,
    toInternalBalance: false,
  }

  return request
}

type BuildPropExitParms = {
  assets: string[]
  bptIn: string
}

export function buildPropExit({ assets, bptIn }: BuildPropExitParms) {
  const userData = WeightedPoolEncoder.exitExactBPTInForTokensOut(bptIn)

  const request = {
    assets,
    minAmountsOut: ['0', '0'],
    userData,
    toInternalBalance: false,
  }

  return request
}