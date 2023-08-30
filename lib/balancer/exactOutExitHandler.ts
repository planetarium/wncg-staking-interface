// 1. queryExit -> exitRes 저장
// 2. exitRes로 exit 하고 hash 리턴

import {
  BalancerSDK,
  formatFixed,
  isSameAddress,
  parseFixed,
} from '@balancer-labs/sdk'

import { ZERO_ADDRESS } from 'config/constants/addresses'
import type { ExitParams, ExitPoolHandler, ExitQueryOutput } from './types'
import { formatAddressForSor } from './utils'

export type QueryExactOutExitParams = {
  account: Hash
  amountsOut: string[]
  slippageBsp: string
  assets: TokenInfo[]
}

//  implements ExitPoolHandler
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
    const slippage = slippageBsp.toString()

    const sdkPool = await this.sdk.pools.find(this.poolId)

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

    // Add native asset to the list of tokens to exit
    // buildExitExactTokensOut: (exiter: string, tokensOut: string[], amountsOut: string[], slippage: string, toInternalBalance?: boolean) => ExitExactTokensOutAttributes;

    // expectedBPTIn: string;
    // maxBPTIn: string;
    // priceImpact: string;
    const exitRes = sdkPool!.buildExitExactTokensOut(
      account,
      poolTokensList,
      fullAmountsOut,
      slippage
    )

    if (!exitRes) throw new Error('Failed to construct exit.')

    // Because this is an exit we need to pass amountsOut as the amountsIn and
    // bptIn as the minBptOut to this calcPriceImpact function.
    const evmPriceImpact = await sdkPool!.calcPriceImpact(
      fullAmountsOut,
      exitRes.expectedBPTIn,
      false
    )

    const priceImpact = Number(formatFixed(evmPriceImpact, 18))

    return {
      amountsOut: poolTokensList.map((t) =>
        t === tokenOutAddress ? amountOut : '0'
      ),
      priceImpact,
      exitRes,
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
