// https://github.com/balancer-labs/frontend-v2

import { BigNumber } from 'ethers'
import type { BigNumberish } from 'ethers'
import { formatUnits, getAddress, parseUnits } from 'ethers/lib/utils'
import OldBigNumber from 'bignumber.js'
import {
  isSameAddress,
  weightedBPTForTokensZeroPriceImpact as _bptForTokensZeroPriceImpact,
} from '@balancer-labs/sdk'
import { WeightedMath } from '@georgeroman/balancer-v2-pools'

import { bnum } from 'utils/num'
import { getTokenInfo } from 'utils/token'
import { configService } from './config'

const POOL_DECIMALS = 18

interface Amounts {
  send: string[]
  receive: string[]
  fixedToken: number
}

type PriceImpactOption = {
  exactOut?: boolean
  tokenIndex?: number | null
  queryBpt?: OldBigNumber
}

export default class CalculatorService {
  constructor(
    public pool: Pool,
    public bptBalance: string,
    public action: PoolAction,
    public useNativeAsset = false,
    public readonly config = configService
  ) {}

  exactTokensInForBptOut(tokenAmounts: string[]): OldBigNumber {
    const balances = this.poolTokenBalances.map((b) => bnum(b.toString()))
    const weights = this.poolTokenWeights.map((w) => bnum(w.toString()))
    const amountsIn = this.denormAmounts(tokenAmounts).map((a) =>
      bnum(a.toString())
    )

    return WeightedMath._calcBptOutGivenExactTokensIn(
      balances,
      weights,
      amountsIn,
      bnum(this.poolTotalShares.toString()),
      bnum(this.poolSwapFee.toString())
    )
  }

  bptInForExactTokensOut(tokenAmounts: string[]): OldBigNumber {
    const balances = this.poolTokenBalances.map((b) => bnum(b.toString()))
    const weights = this.poolTokenWeights.map((w) => bnum(w.toString()))
    const amountsOut = this.denormAmounts(tokenAmounts).map((a) =>
      bnum(a.toString())
    )

    return WeightedMath._calcBptInGivenExactTokensOut(
      balances,
      weights,
      amountsOut,
      bnum(this.poolTotalShares.toString()),
      bnum(this.poolSwapFee.toString())
    )
  }

  bptInForExactTokenOut(amount: string, tokenIndex: number): OldBigNumber {
    const balance = bnum(this.poolTokenBalances[tokenIndex].toString())
    const weight = bnum(this.poolTokenWeights[tokenIndex].toString())
    const amountOut = bnum(
      parseUnits(amount, this.poolTokenDecimals[tokenIndex]).toString()
    )

    return WeightedMath._calcBptInGivenExactTokenOut(
      balance,
      weight,
      amountOut,
      bnum(this.poolTotalShares.toString()),
      bnum(this.poolSwapFee.toString())
    )
  }

  exactBptInForTokenOut(bptAmount: string, tokenIndex: number): OldBigNumber {
    const balance = bnum(this.poolTokenBalances[tokenIndex].toString())
    const weight = bnum(this.poolTokenWeights[tokenIndex].toString())

    return WeightedMath._calcTokenOutGivenExactBptIn(
      balance,
      weight,
      bnum(bptAmount),
      bnum(this.poolTotalShares.toString()),
      bnum(this.poolSwapFee.toString())
    )
  }

  propAmountsGiven(
    amount: string,
    index: number,
    type: 'send' | 'receive'
  ): Amounts {
    if (amount.trim() === '') {
      return { send: [], receive: [], fixedToken: 0 }
    }

    const types = ['send', 'receive']
    const fixedTokenAddress = this.tokenOf(type, index)
    const fixedToken = getTokenInfo(fixedTokenAddress)
    const fixedTokenDecimals = fixedToken?.decimals || 18
    const fixedAmount = bnum(amount).toFixed(fixedTokenDecimals)
    const fixedDenormAmount = parseUnits(fixedAmount, fixedTokenDecimals)
    const fixedRatio = this.ratioOf(type, index)
    const amounts = {
      send: this.sendTokens.map(() => ''),
      receive: this.receiveTokens.map(() => ''),
      fixedToken: index,
    }

    amounts[type][index] = fixedAmount
    ;[this.sendRatios, this.receiveRatios].forEach((ratios, ratioType) => {
      ratios.forEach((ratio, i) => {
        if (i !== index || type !== types[ratioType]) {
          const tokenAddress = this.tokenOf(types[ratioType], i)
          const token = getTokenInfo(tokenAddress)

          amounts[types[ratioType] as 'send' | 'receive'][i] = formatUnits(
            fixedDenormAmount.mul(ratio).div(fixedRatio),
            token?.decimals ?? 18
          ).replace(/0+$/, '')
        }
      })
    })

    return amounts
  }

  priceImpact(tokenAmounts: string[], option: PriceImpactOption): OldBigNumber {
    let bptAmount: OldBigNumber
    let bptZeroPriceImpact

    if (this.action === 'join') {
      bptAmount = this.exactTokensInForBptOut(tokenAmounts)
      if (bptAmount.lte(0)) return bnum(0)

      bptZeroPriceImpact = this.bptForTokensZeroPriceImpact(tokenAmounts)
      return bnum(1).minus(bptAmount.div(bptZeroPriceImpact))
    }

    const { exactOut, tokenIndex } = option || {
      exactOut: false,
      tokenIndex: 0,
    }

    if (exactOut) {
      bptAmount = this.bptInForExactTokensOut(tokenAmounts)
      bptZeroPriceImpact = this.bptForTokensZeroPriceImpact(tokenAmounts)
    } else {
      bptAmount =
        option.queryBpt ||
        bnum(parseUnits(this.bptBalance, POOL_DECIMALS).toString())

      tokenAmounts = this.poolTokens.map((_, i) => {
        if (i !== tokenIndex) return '0'
        const tokenAmount = this.exactBptInForTokenOut(
          bptAmount.toString(),
          tokenIndex
        ).toString()

        return formatUnits(
          tokenAmount,
          this.poolTokenDecimals[tokenIndex]
        ).toString()
      })

      bptZeroPriceImpact = this.bptForTokensZeroPriceImpact(tokenAmounts)
    }

    return bnum(bptAmount).div(bptZeroPriceImpact).minus(1)
  }

  bptForTokensZeroPriceImpact(tokenAmounts: string[]): OldBigNumber {
    const denormAmounts = this.denormAmounts(tokenAmounts)

    return bnum(
      _bptForTokensZeroPriceImpact(
        this.poolTokenBalances,
        this.poolTokenDecimals,
        this.poolTokenWeights,
        denormAmounts,
        this.poolTotalShares
      ).toString()
    )
  }

  denormAmounts(amounts: string[]): BigNumber[] {
    return amounts.map((amount, i) =>
      parseUnits(amount, this.poolTokenDecimals[i])
    )
  }

  tokenOf(type: string, index: number): string {
    const key = `${type}Tokens` as 'sendTokens' | 'receiveTokens'
    return getAddress(this[key][index])
  }

  ratioOf(type: string, index: number): BigNumberish {
    const key = `${type}Ratios` as 'sendRatios' | 'receiveRatios'
    return this[key][index]
  }

  get tokenAddresses(): string[] {
    if (this.useNativeAsset) {
      return this.pool.tokensList.map((address) => {
        if (isSameAddress(address, this.config.weth)) {
          return this.config.network.nativeAsset.address
        }
        return address
      })
    }

    return this.pool.tokensList
  }

  get poolTokens(): PoolToken[] {
    return this.pool.tokens
  }

  get poolTokenDecimals(): number[] {
    return this.poolTokens.map((t) => t.decimals)
  }

  get poolTokenBalances(): BigNumber[] {
    const normalizedBalances = this.poolTokens.map((t) => t.balance)
    return normalizedBalances.map((b, i) =>
      parseUnits(b, this.poolTokenDecimals[i])
    )
  }

  get poolTokenWeights(): BigNumber[] {
    const normalizedWeights = this.poolTokens.map((t) => t.weight)
    return normalizedWeights.map((w) => parseUnits(w, 18))
  }

  get poolTotalShares(): BigNumber {
    return parseUnits(this.pool.totalShares || '0', POOL_DECIMALS)
  }

  get poolSwapFee(): BigNumber {
    return parseUnits(this.pool.swapFee || '0', 18)
  }

  private get sendTokens(): string[] {
    if (this.action === 'join') return this.tokenAddresses
    return [this.pool.address]
  }

  private get receiveTokens(): string[] {
    if (this.action === 'join') return [this.pool.address]
    return this.tokenAddresses
  }

  private get sendRatios(): BigNumberish[] {
    if (this.action === 'join') return this.poolTokenBalances
    return [this.poolTotalShares]
  }

  private get receiveRatios(): BigNumberish[] {
    if (this.action === 'join') return [this.poolTotalShares]
    return this.poolTokenBalances
  }
}
