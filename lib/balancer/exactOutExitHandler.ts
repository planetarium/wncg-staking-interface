import { BalancerSDK, formatFixed, parseFixed } from '@balancer-labs/sdk'
import { isSameAddress } from '@balancer/sdk'

import { ZERO_ADDRESS } from 'config/constants/addresses'
import type { ExitQueryOutput, QueryExactOutExitParams } from './types'
import { formatAddressForSor } from './utils'

export class ExactOutExitHandler {
  constructor(
    public readonly poolId: string,
    public readonly poolTokens: PoolToken[],
    public readonly tokens: TokenMap,
    public readonly sdk: BalancerSDK
  ) {}

  async queryExit({
    account,
    amountsOut,
    slippageBsp,
    assets,
  }: QueryExactOutExitParams): Promise<ExitQueryOutput> {
    const sdkPool = await this.sdk.pools.find(this.poolId)
    if (!sdkPool) throw new Error('Failed to find pool: ' + this.poolId)

    const slippage = slippageBsp.toString()

    const tokenOut = assets[0]
    const tokenOutAddress = formatAddressForSor(tokenOut.address)
    const nativeAssetExit = isSameAddress(tokenOutAddress, ZERO_ADDRESS)

    const poolTokensList = this.poolTokens.map((t) =>
      nativeAssetExit ? ZERO_ADDRESS : t.address
    )
    const tokenOutIndex = poolTokensList.indexOf(tokenOutAddress)

    const amountOut = amountsOut[0]
    if (!amountOut) throw new Error('No exit amount given')

    const evmAmountOut = parseFixed(amountOut, tokenOut.decimals).toString()
    const fullAmountsOut = this.getFullAmounts(tokenOutIndex, evmAmountOut)

    const response = sdkPool!.buildExitExactTokensOut(
      account,
      poolTokensList,
      fullAmountsOut,
      slippage
    )

    if (!response) throw new Error('Failed to construct exit.')

    // Because this is an exit we need to pass amountsOut as the amountsIn and
    // bptIn as the minBptOut to this calcPriceImpact function.
    const evmPriceImpact = await sdkPool!.calcPriceImpact(
      fullAmountsOut,
      response.expectedBPTIn,
      false
    )

    const priceImpact = Number(formatFixed(evmPriceImpact, 18))

    return {
      amountsOut: poolTokensList.map((t) =>
        t === tokenOutAddress ? amountOut : '0'
      ),
      priceImpact,
      exitRes: response,
    }
  }

  private getFullAmounts(
    tokenOutIndex: number,
    tokenOutAmount: string
  ): string[] {
    return this.poolTokens.map((_, i) =>
      i === tokenOutIndex ? tokenOutAmount : '0'
    )
  }
}
