// 1. queryExit -> exitRes 저장
// 2. exitRes로 exit 하고 hash 리턴

import {
  BalancerSDK,
  formatFixed,
  isSameAddress,
  parseFixed,
} from '@balancer-labs/sdk'

import { NATIVE_CURRENCY_ADDRESS } from 'config/constants/addresses'
import type { ExitParams, ExitPoolHandler, ExitQueryOutput } from './types'
import { formatAddressForSor } from './utils'

export type QueryExactInExitParams = {
  account: Hash
  bptIn: string
  slippageBsp: string
  assets: TokenInfo[]
}

export class ExactInExitHandler implements ExitPoolHandler {
  constructor(
    public readonly poolId: string,
    public readonly poolTokens: PoolToken[],
    public readonly tokens: TokenMap,
    public readonly sdk: BalancerSDK
  ) {}

  async queryExit({
    account,
    bptIn,
    slippageBsp,
    assets,
  }: QueryExactInExitParams): Promise<ExitQueryOutput> {
    const slippage = slippageBsp.toString()

    const sdkPool = await this.sdk.pools.find(this.poolId)

    if (!sdkPool) throw new Error('Failed to find pool: ' + this.poolId)

    const evmBptIn = parseFixed(bptIn, 18).toString()

    const isSingleTokenExit = assets.length === 1
    const singleExitToken = isSingleTokenExit ? assets[0] : null
    const singleTokenOut = isSingleTokenExit
      ? formatAddressForSor(singleExitToken!.address)
      : undefined

    const shouldUnwrapNativeAsset =
      !!singleTokenOut && isSameAddress(singleTokenOut, NATIVE_CURRENCY_ADDRESS)

    const exitRes = sdkPool.buildExitExactBPTIn(
      account,
      evmBptIn,
      slippage,
      shouldUnwrapNativeAsset,
      singleTokenOut?.toLowerCase(),
      false
    )

    if (!exitRes) throw new Error('Failed to construct exit.')

    const { expectedAmountsOut } = exitRes ?? {}
    // Because this is an exit we need to pass amountsOut as the amountsIn and
    // bptIn as the minBptOut to this calcPriceImpact function.
    const evmPriceImpact = await sdkPool.calcPriceImpact(
      expectedAmountsOut,
      evmBptIn,
      false
    )
    const priceImpact = Number(formatFixed(evmPriceImpact, 18))

    if (!isSingleTokenExit) {
      const amountsOut = expectedAmountsOut.map((amt, i) =>
        formatFixed(amt, this.poolTokens[i].decimals ?? 18).toString()
      )

      return {
        amountsOut,
        priceImpact,
        exitRes,
      }
    }

    const amountsOut = expectedAmountsOut.map((amt, i) =>
      formatFixed(amt, this.poolTokens[i].decimals).toString()
    )

    return {
      amountsOut,
      priceImpact,
      exitRes,
    }
  }

  // private getSingleAmountOut(
  //   amountsOut: string[],
  //   tokenOutIndex: number,
  //   tokenOut: TokenInfo
  // ): string[] {
  //   const amountOut = amountsOut[tokenOutIndex]
  //   const normalizedAmountOut = formatFixed(
  //     amountOut,
  //     tokenOut.decimals
  //   ).toString()

  //   return [normalizedAmountOut]
  // }
}
