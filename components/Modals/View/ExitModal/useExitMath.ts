import { useCallback, useMemo } from 'react'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import BigNumber from 'bignumber.js'

import { POOL_DECIMALS } from 'constants/tokens'
import { bnum, hasAmounts } from 'utils/num'
import { useBalances, useCalculator, usePool, useSlippage } from 'hooks'

type ExitMathParams = {
  exactOut: boolean
  isProportional: boolean
  tokenOutIndex: number
  tokenOutAmount: string
  percent: number
}

export function useExitMath() {
  const { bptBalance } = useBalances()
  const calculator = useCalculator('exit')
  const {
    poolTokenAddresses,
    poolTokenBalances,
    poolTokenDecimals,
    poolTotalShares,
  } = usePool()
  const { addSlippageScaled } = useSlippage()

  const amountsOutPlaceholder = useMemo(
    () => poolTokenAddresses.map((_) => '0') || [],
    [poolTokenAddresses]
  )

  const singleExitMaxAmounts = useMemo(() => {
    try {
      const _bptBalanceScaled =
        parseUnits(bptBalance, POOL_DECIMALS).toString() || '0'

      return poolTokenDecimals.map((decimals, i) => {
        return formatUnits(
          calculator?.exactBptInForTokenOut(_bptBalanceScaled, i).toString() ||
            '0',
          decimals || 18
        )
      })
    } catch (error) {
      return amountsOutPlaceholder
    }
  }, [amountsOutPlaceholder, bptBalance, calculator, poolTokenDecimals])

  // NOTE: Maximum BPT allowed: 30%
  const _absMaxBpt = useMemo(() => {
    const poolMax = bnum(poolTotalShares)
      .times(0.3)
      .toFixed(POOL_DECIMALS, BigNumber.ROUND_DOWN)
    return BigNumber.min(bptBalance, poolMax).toString()
  }, [bptBalance, poolTotalShares])

  const _propBptIn = useCallback(
    (pcnt: number) =>
      formatUnits(
        parseUnits(bptBalance, POOL_DECIMALS).mul(pcnt).div(100).toString() ??
          '0',
        POOL_DECIMALS
      ),
    [bptBalance]
  )

  const _propAmounts = useCallback(
    (pcnt: number) =>
      calculator?.propAmountsGiven(_propBptIn(pcnt), 0, 'send')?.receive ||
      amountsOutPlaceholder,
    [amountsOutPlaceholder, _propBptIn, calculator]
  )

  const checkTokenOutAmountExceedsPoolBalance = useCallback(
    (tokenOutIndex: number, tokenOutAmount: string) => {
      return poolTokenBalances[tokenOutIndex]
        ? bnum(tokenOutAmount).gt(poolTokenBalances[tokenOutIndex])
        : false
    },
    [poolTokenBalances]
  )

  const calcBptIn = useCallback(
    (params: ExitMathParams) => {
      const {
        exactOut,
        isProportional,
        tokenOutAmount,
        tokenOutIndex,
        percent,
      } = params

      let _bptIn: string

      if (isProportional) {
        _bptIn = parseUnits(_propBptIn(percent), POOL_DECIMALS).toString()
      } else if (!exactOut) {
        _bptIn = parseUnits(_absMaxBpt, POOL_DECIMALS).toString()
      } else {
        _bptIn =
          calculator
            ?.bptInForExactTokenOut(tokenOutAmount, tokenOutIndex)
            .toString() || '0'
      }

      if (exactOut) return addSlippageScaled(_bptIn)
      return _bptIn.toString()
    },
    [_absMaxBpt, _propBptIn, addSlippageScaled, calculator]
  )

  const calcExitAmounts = useCallback(
    (params: ExitMathParams) => {
      const { isProportional, tokenOutIndex, tokenOutAmount, percent } = params

      if (isProportional) return _propAmounts(percent)
      return poolTokenAddresses.map((_, i) => {
        if (i !== tokenOutIndex) return '0'
        return tokenOutAmount || '0'
      })
    },
    [_propAmounts, poolTokenAddresses]
  )

  const calcPriceImpact = useCallback(
    (params: ExitMathParams) => {
      const _amountsOut = calcExitAmounts(params)

      const { exactOut, isProportional, tokenOutAmount, tokenOutIndex } = params

      if (isProportional || !hasAmounts(_amountsOut)) return 0
      if (checkTokenOutAmountExceedsPoolBalance(tokenOutIndex, tokenOutAmount))
        return 1

      const _bptIn = calcBptIn(params)

      try {
        const impact =
          calculator
            ?.priceImpact(_amountsOut, {
              exactOut,
              tokenIndex: tokenOutIndex,
              queryBpt: bnum(_bptIn),
            })
            .toNumber() || 0
        return Math.min(impact, 1)
      } catch (error) {
        return 1
      }
    },
    [
      calcExitAmounts,
      calcBptIn,
      calculator,
      checkTokenOutAmountExceedsPoolBalance,
    ]
  )

  return {
    calcExitAmounts,
    calcBptIn,
    calcPriceImpact,
    checkTokenOutAmountExceedsPoolBalance,
    singleExitMaxAmounts,
  }
}
