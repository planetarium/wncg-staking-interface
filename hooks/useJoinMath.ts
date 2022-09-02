import { useCallback } from 'react'

import { configService } from 'services/config'
import { bnum, hasAmounts } from 'utils/num'
import { useBalances } from './useBalances'
import { useCalculator } from './useCalculator'
import { useFiatCurrency } from './useFiatCurrency'
import { usePool } from './usePool'

export function useJoinMath() {
  const { balanceFor } = useBalances()
  const calculator = useCalculator('join')
  const { poolTokenAddresses } = usePool()
  const { toFiat } = useFiatCurrency()

  const calcMinBptOut = useCallback(
    (amounts: string[]) => {
      return calculator?.exactTokensInForBptOut(amounts).toString() || '0'
    },
    [calculator]
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
      const userPoolBalances =
        poolTokenAddresses.map((address) => {
          address =
            isNativeAsset && address === configService.weth
              ? configService.nativeAssetAddress
              : address
          return balanceFor(address)
        }) || []

      const propMinAmounts = userPoolBalances.map((balance, i) => {
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
    [balanceFor, calculator, toFiat, poolTokenAddresses]
  )

  return {
    calcMinBptOut,
    calcOptimizedAmounts,
    calcPriceImpact,
    calcPropAmounts,
  }
}
