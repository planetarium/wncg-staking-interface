import { useCallback } from 'react'

import { bnum } from 'utils/bnum'
import { hasAmounts } from 'utils/hasAmounts'
import { useCalculator, useFiat, useSlippage, useStaking } from 'hooks'

export function useJoinMath() {
  const calculator = useCalculator('join')
  const toFiat = useFiat()
  const { poolTokenAddresses } = useStaking()
  const { minusSlippageScaled } = useSlippage()

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
        const impact =
          calculator
            ?.priceImpact(amounts, {
              queryBpt: fullBptOut,
            })
            .toNumber() || 0
        return Math.min(impact, 1)
      } catch (error) {
        return 1
      }
    },
    [calculator]
  )

  const calcPropAmount = useCallback(
    (amount: string, fixedTokenIndex: number) => {
      const { send } =
        calculator?.propAmountsGiven(
          bnum(amount).toString(),
          fixedTokenIndex,
          'send'
        ) || {}
      const propAmounts = (send ?? ['0', '0']).map((amt) =>
        bnum(amt).toString()
      )

      return propAmounts[1 - fixedTokenIndex]
    },
    [calculator]
  )

  const calcOptimizedAmounts = useCallback(
    (availableBalances: string[]) => {
      const _propMinAmounts = availableBalances.map((balance, i) => {
        return (
          calculator?.propAmountsGiven(balance, i, 'send')?.send ?? ['0', '0']
        ).map((amt) => bnum(amt).toString())
      })

      const length = availableBalances.length

      const feasiblePropMinAmounts = _propMinAmounts.filter((amounts, i) => {
        const counterIndexes = Array.from(Array(length).keys())
        counterIndexes.splice(i, 1)

        return counterIndexes.every((i) =>
          bnum(amounts[i]).lte(availableBalances[i])
        )
      })

      const propMinAmountsInFiatValue = feasiblePropMinAmounts.map(
        (amounts) => {
          return amounts
            .reduce((total, amount, i) => {
              const address = poolTokenAddresses[i]
              if (!address) return total
              return total.plus(toFiat(amount, address))
            }, bnum(0))
            .toNumber()
        }
      )

      const minIndex = propMinAmountsInFiatValue.indexOf(
        Math.min(...propMinAmountsInFiatValue)
      )

      return feasiblePropMinAmounts[minIndex] || ['0', '0']
    },
    [calculator, poolTokenAddresses, toFiat]
  )

  return {
    calcMinBptOut,
    calcOptimizedAmounts,
    calcPriceImpact,
    calcPropAmount,
  }
}
