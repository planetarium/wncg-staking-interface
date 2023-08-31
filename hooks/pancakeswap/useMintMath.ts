import { useCallback } from 'react'
import { Currency, CurrencyAmount } from '@pancakeswap/aptos-swap-sdk'

import { AddLiquidityField } from 'config/constants'
import { parseUnits } from 'utils/parseUnits'
import { usePair } from './usePair'

export function useMintMath() {
  const pair = usePair()
  const { token0, token1 } = pair

  const calcPropAmountIn = useCallback(
    (independentField: 'TokenA' | 'TokenB', inputValue: string) => {
      const dependentField =
        independentField === AddLiquidityField.TokenA
          ? AddLiquidityField.TokenB
          : AddLiquidityField.TokenA
      const independentToken =
        independentField === AddLiquidityField.TokenA ? token0 : token1

      const independentAmount: CurrencyAmount<Currency> =
        CurrencyAmount.fromRawAmount(
          independentToken,
          parseUnits(inputValue, 18).toString()
        )

      const wrappedIndependentAmount = independentAmount?.wrapped
      const [tokenA, tokenB] = [token0?.wrapped, token1?.wrapped]

      // Calc dependent amount
      if (tokenA && tokenB && wrappedIndependentAmount && pair) {
        const dependentCurrency =
          dependentField === AddLiquidityField.TokenB ? token1 : token0
        const dependentTokenAmount =
          dependentField === AddLiquidityField.TokenB
            ? pair.priceOf(tokenA).quote(wrappedIndependentAmount)
            : pair.priceOf(tokenB).quote(wrappedIndependentAmount)
        return dependentCurrency?.isNative
          ? CurrencyAmount.fromRawAmount(
              dependentCurrency,
              dependentTokenAmount.quotient
            )
          : dependentTokenAmount
      }

      return undefined
    },
    [pair, token0, token1]
  )

  return calcPropAmountIn
}
