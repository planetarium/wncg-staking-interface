import { useCallback, useMemo } from 'react'
import { useRecoilValue } from 'recoil'

import { getUserBalances } from 'app/states/balance'
import { poolState, poolTokenSymbolsState } from 'app/states/pool'
import CalculatorService from 'lib/calculator'
import { bnum } from 'utils/num'
import { useAppSelector } from './useRedux'
import { useUsd } from './useUsd'

export function useInvestMath() {
  const { calculateUsdValue } = useUsd()

  const pool = useRecoilValue(poolState)
  const poolTokenSymbols = useRecoilValue(poolTokenSymbolsState)

  const userBalances = useAppSelector(getUserBalances)
  const bptBalance = userBalances.bpt

  const calculator = useMemo(() => {
    if (!pool) return null
    return new CalculatorService(pool, bptBalance, 'join')
  }, [bptBalance, pool])

  const getMinBptOut = useCallback(
    (amounts: string[]) => {
      return calculator?.exactTokensInForBptOut(amounts).toString() || '0'
    },
    [calculator]
  )

  const getPriceImpact = useCallback(
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

  const getPropAmounts = useCallback(
    (amounts: string[], fixedTokenIndex: number) => {
      const index = fixedTokenIndex === 1 ? 0 : 1
      const { send } =
        calculator?.propAmountsGiven(amounts[index], index, 'send') || {}
      return send || ['0', '0']
    },
    [calculator]
  )

  const getUserPoolTokenBalances = useCallback(
    (isNativeAsset: boolean) => {
      return poolTokenSymbols.map((symb) => {
        let symbol = symb as PoolTokenSymbol | 'eth'
        if (symbol === 'weth' && isNativeAsset) {
          symbol = 'eth'
        }
        return userBalances[symbol] || '0'
      })
    },
    [poolTokenSymbols, userBalances]
  )

  const getOptimizedAmounts = useCallback(
    (isNativeAsset: boolean) => {
      const userPoolBalances = getUserPoolTokenBalances(isNativeAsset)

      const propMaxAmounts = userPoolBalances.map(
        (balance, i) =>
          calculator?.propAmountsGiven(balance, i, 'send')?.send || ['0', '0']
      )
      const propMaxAmountsInUsdValue = propMaxAmounts.map((amounts) => {
        return amounts.reduce((acc, amount, i) => {
          const tokenName = poolTokenSymbols[i]
          acc += calculateUsdValue(tokenName, amount)
          return acc
        }, 0)
      })
      const maxIndex = propMaxAmountsInUsdValue.indexOf(
        Math.max(...propMaxAmountsInUsdValue)
      )

      return propMaxAmounts[maxIndex] || ['0', '0']
    },
    [calculateUsdValue, calculator, getUserPoolTokenBalances, poolTokenSymbols]
  )

  return {
    getMinBptOut,
    getOptimizedAmounts,
    getPriceImpact,
    getPropAmounts,
  }
}

function hasAmounts(amounts: string[]) {
  return amounts.some((amount) => bnum(amount).gt(0))
}
