import type { BigNumberish } from 'ethers'
import { WeightedPoolEncoder } from '@balancer-labs/sdk'

import { bnum } from './bnum'

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

type BuildExitParams = {
  assets: string[]
  bptIn: string
  isExactOut: boolean
  isPropExit: boolean
  minAmountsOut: string[]
}

export function buildExit({
  assets,
  bptIn,
  isExactOut,
  isPropExit,
  minAmountsOut,
}: BuildExitParams) {
  let userData: string

  switch (true) {
    case isPropExit:
      userData = WeightedPoolEncoder.exitExactBPTInForTokensOut(bptIn)
      break
    case isExactOut:
      userData = WeightedPoolEncoder.exitBPTInForExactTokensOut(
        minAmountsOut,
        bptIn
      )
      break
    default:
      const tokenOutIndex = minAmountsOut.findIndex((amount) =>
        bnum(amount).gt(0)
      )
      userData = WeightedPoolEncoder.exitExactBPTInForOneTokenOut(
        bptIn,
        tokenOutIndex
      )
  }

  const request = {
    assets,
    minAmountsOut,
    userData,
    toInternalBalance: false,
  }

  return request
}

type BuildSingleExitParams = {
  assets: string[]
  bptIn: string
  isExactOut: boolean
  minAmountsOut: string[]
  tokenOutIndex: number
}

export function buildSingleExit({
  assets,
  bptIn,
  isExactOut,
  minAmountsOut,
  tokenOutIndex,
}: BuildSingleExitParams) {
  const userData = isExactOut
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

export function counterTokenIndex(currentIndex: number) {
  return currentIndex === 0 ? 1 : 0
}
