import { BalancerSDK, parseFixed } from '@balancer-labs/sdk'

import type {
  QuerySingleMaxExitParams,
  SingleMaxQueryOutput,
  SingleTokenExitHandler,
} from './types'

export class SingleMaxExitHandler implements SingleTokenExitHandler {
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
    tokenOut,
  }: QuerySingleMaxExitParams): Promise<SingleMaxQueryOutput> {
    try {
      if (!account) throw new Error('No account')

      const sdkPool = await this.sdk.pools.find(this.poolId)
      if (!sdkPool) throw new Error('Failed to find pool: ' + this.poolId)

      const exitParams = sdkPool.buildQueryExitToSingleToken({
        sender: account,
        recipient: account,
        minAmountsOut: this.poolTokens.map((_) => parseFixed('0')),
        bptIn: parseFixed(bptIn, 18),
        tokenOut,
        toInternalBalance: false,
      })
      // @ts-ignore
      return exitParams
    } catch (error) {
      throw error
    }
  }
}
