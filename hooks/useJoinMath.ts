import { useCallback } from 'react'

import { configService } from 'services/config'
import { bnum, hasAmounts } from 'utils/num'
import { useBalances } from './useBalances'
import { useCalculator } from './useCalculator'
import { useFiatCurrency } from './useFiatCurrency'
import { usePool } from './usePool'
import { useSlippage } from './useSlippage'

export function useJoinMath() {
  const { balanceFor } = useBalances()
  const calculator = useCalculator('join')
  const { nativeAssetIndex, poolTokenAddresses } = usePool()
  const { toFiat } = useFiatCurrency()
  const { minusSlippageScaled } = useSlippage()

  const calcUserPoolTokenBalances = useCallback(
    (isNativeAsset: boolean) =>
      poolTokenAddresses.map((address, i) => {
        if (!isNativeAsset || i !== nativeAssetIndex) return balanceFor(address)
        return balanceFor(configService.nativeAssetAddress)
      }),
    [balanceFor, nativeAssetIndex, poolTokenAddresses]
  )

  const calcUserPoolTokenBalancesAvailable = useCallback(
    (isNativeAsset: boolean) => {
      const _balances = calcUserPoolTokenBalances(isNativeAsset)
      return _balances.map((amount, i) => {
        if (!isNativeAsset || i !== nativeAssetIndex) return amount
        return Math.max(bnum(amount).minus(0.05).toNumber(), 0).toString()
      })
    },
    [calcUserPoolTokenBalances, nativeAssetIndex]
  )

  const calcMinBptOut = useCallback(
    (amounts: string[]) => {
      const minBpt =
        calculator?.exactTokensInForBptOut(amounts).toString() || '0'
      return minusSlippageScaled(minBpt)
    },
    [calculator, minusSlippageScaled]
  )

  const calcPriceImpact = useCallback(
    (amounts: string[]) => {
      if (!hasAmounts(amounts)) return 0

      try {
        const fullBptOut = calculator?.exactTokensInForBptOut(amounts)
        return (
          calculator
            ?.priceImpact(amounts, {
              queryBpt: fullBptOut,
            })
            .toNumber() || 0
        )
      } catch (error) {
        return 1
      }
    },
    [calculator]
  )

  const calcPropAmounts = useCallback(
    (amounts: string[], fixedTokenIndex: number) => {
      const index = fixedTokenIndex === 1 ? 0 : 1
      const { send } =
        calculator?.propAmountsGiven(amounts[index], index, 'send') || {}
      return send || ['0', '0']
    },
    [calculator]
  )

  const calcOptimizedAmounts = useCallback(
    (isNativeAsset: boolean) => {
      const _balances = calcUserPoolTokenBalancesAvailable(isNativeAsset)

      const propMinAmounts = _balances.map((balance, i) => {
        return (
          calculator?.propAmountsGiven(balance, i, 'send')?.send || ['0', '0']
        )
      })

      const propMinAmountsInFiatValue = propMinAmounts.map((amounts) => {
        return amounts
          .reduce((total, amount, i) => {
            const address = poolTokenAddresses[i]
            if (!address) return total
            return total.plus(toFiat(address, amount))
          }, bnum(0))
          .toNumber()
      })
      const minIndex = propMinAmountsInFiatValue.indexOf(
        Math.min(...propMinAmountsInFiatValue)
      )

      return propMinAmounts[minIndex] || ['0', '0']
    },
    [calcUserPoolTokenBalancesAvailable, calculator, poolTokenAddresses, toFiat]
  )

  return {
    calcMinBptOut,
    calcOptimizedAmounts,
    calcPriceImpact,
    calcPropAmounts,
    calcUserPoolTokenBalances,
    calcUserPoolTokenBalancesAvailable,
  }
}
