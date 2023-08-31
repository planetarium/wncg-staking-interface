import { isSameAddress } from '@balancer-labs/sdk'

import { formatUnits } from 'utils/formatUnits'
import { parseUnits } from 'utils/parseUnits'
import { bnum } from 'utils/bnum'
import type { PropJoinCalculator } from './types'

export class CalcPropJoinHandler implements PropJoinCalculator {
  constructor(
    public readonly chainId: ChainId,
    public readonly poolTokens: PoolToken[],
    public readonly tokens: TokenMap,
    public readonly isNative: boolean,
    public readonly maxSafeBalances: string[]
  ) {}

  get poolTokenAddresses() {
    return this.poolTokens.map((t) => t.address)
  }

  // Scaled pool token balances
  get poolTokenBalances(): Record<Hash, BigNumber> {
    const entries = this.poolTokens.map((t) => [
      t.address,
      parseUnits(t.balance, t.decimals),
    ])

    return Object.fromEntries(entries)
  }

  private calcPropValue = (
    fixedAmountIn: string,
    fixedToken: TokenInfo,
    variantToken: TokenInfo
  ) => {
    if (isSameAddress(fixedToken.address, variantToken.address)) {
      return fixedAmountIn
    }

    // Pool balance of each token
    const fixedTokenPoolBalance =
      this.poolTokenBalances[fixedToken.address] ?? parseUnits('0')
    const variantTokenPoolBalance =
      this.poolTokenBalances[variantToken.address] ?? parseUnits('0')

    // Fixed amount of each token
    const scaledFixedTokenAmount = parseUnits(
      fixedAmountIn,
      fixedToken.decimals
    ).toString()
    const scaledVariantTokenAmount = variantTokenPoolBalance
      .times(scaledFixedTokenAmount)
      .div(fixedTokenPoolBalance)
      .toFixed(0, 3)

    // Format scaled value
    return formatUnits(scaledVariantTokenAmount, variantToken.decimals)
  }

  calcPropAmountsIn = (
    fixedAmountIn: string,
    fixedToken: TokenInfo
  ): string[] => {
    if (fixedAmountIn.trim() === '') return ['', '']

    return this.poolTokenAddresses.map((addr) => {
      const variantToken = this.tokens[addr]
      return this.calcPropValue(fixedAmountIn, fixedToken, variantToken)
    })
  }

  getPropMaxAmountsIn(): string[] {
    let maxAmountsIn = this.poolTokenAddresses.map((_) => '0')

    this.poolTokenAddresses.forEach((addr, i) => {
      let hasBalance = true

      const propAmountsIn = this.calcPropAmountsIn(
        this.maxSafeBalances[i],
        this.tokens[addr]
      )

      propAmountsIn.forEach((amt, i) => {
        const exceedsBalance = bnum(amt).gt(this.maxSafeBalances[i])
        if (exceedsBalance) hasBalance = false
      })

      if (!hasBalance) return

      const currentMaxAmount =
        maxAmountsIn.find((_, i) =>
          isSameAddress(this.poolTokenAddresses[i], addr)
        ) || '0'

      const thisAmount =
        propAmountsIn.find((_, i) =>
          isSameAddress(this.poolTokenAddresses[i], addr)
        ) || '0'

      if (bnum(thisAmount).gt(currentMaxAmount)) {
        maxAmountsIn = propAmountsIn
      }
    })

    return maxAmountsIn
  }

  get propMaxAmountsIn(): string[] {
    return this.getPropMaxAmountsIn()
  }
}
