import { BalancerSDK } from '@balancer-labs/sdk'
import { formatFixed, parseFixed } from '@ethersproject/bignumber'

import { bnum } from 'utils/bnum'
import { formatAddressForSor } from './utils'
import type {
  ExactInJoinResponse,
  JoinParams,
  JoinPoolHandler,
  JoinQueryOutput,
} from './types'

// 1. queryJoin -> joinRes 저장
// 2. joinRes로 join 하고 hash 리턴
export class ExactInJoinHandler implements JoinPoolHandler {
  private joinRes?: ExactInJoinResponse

  constructor(
    public readonly poolId: string,
    public readonly tokens: TokenMap,
    public readonly sdk: BalancerSDK
  ) {}

  // Join 요청 보냄
  async join(params: JoinParams) {
    await this.queryJoin(params)

    if (!this.joinRes) {
      throw new Error('Could not query generalised join')
    }

    // value property must be passed if joining with native asset
    // return txBuilder.raw.sendTransaction({ to, data, value })
  }

  // NOTE: bptOut, priceImpact, joinRes
  async queryJoin({
    assets,
    amountsIn,
    account,
    slippage,
  }: JoinParams): Promise<JoinQueryOutput> {
    const _scaledAmountsIn: string[] = assets.map((addr, i) => {
      const token = this.tokens[addr]
      if (!token) return '0'
      return parseFixed(amountsIn[i] || '0', token.decimals).toString()
    })

    const sdkPool = await this.sdk.pools.find(this.poolId)

    if (!sdkPool) throw new Error('Failed to find pool: ' + this.poolId)
    const _tokensIn = assets.map((addr) => formatAddressForSor(addr))

    const joinRes = sdkPool.buildJoin(
      account,
      _tokensIn,
      _scaledAmountsIn,
      slippage
    )

    if (!joinRes) {
      throw new Error('Failed to fetch expected output.')
    }

    const { expectedBPTOut } = joinRes
    if (bnum(expectedBPTOut).eq(0))
      throw new Error('Failed to fetch expected output.')

    const bptOut = formatFixed(expectedBPTOut, 18)

    const evmPriceImpact = await sdkPool.calcPriceImpact(
      _scaledAmountsIn,
      expectedBPTOut,
      true
    )

    const priceImpact = formatFixed(evmPriceImpact, 18)

    return {
      bptOut,
      priceImpact,
      joinRes,
    }
  }
}
