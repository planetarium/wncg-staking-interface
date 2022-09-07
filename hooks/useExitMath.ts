import { useCallback, useMemo } from 'react'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import BigNumber from 'bignumber.js'

import { POOL_DECIMALS } from 'constants/tokens'
import { bnum, hasAmounts } from 'utils/num'
import { useBalances } from './useBalances'
import { useCalculator } from './useCalculator'
import { usePool } from './usePool'
import { useSlippage } from './useSlippage'

type Params = {
  exactOut: boolean
  isProportional: boolean
  tokenOutIndex: number
  tokenOutAmount: string
  percent: number
}

export function useExitMath() {
  const { bptBalance } = useBalances()
  const calculator = useCalculator('exit')
  const { poolTokens, poolTokenBalances, poolTotalShares } = usePool()
  const { addSlippageScaled } = useSlippage()

  const _amountsOutPlaceholder = useMemo(
    () => poolTokens.map((_) => '0') || [],
    [poolTokens]
  )

  // NOTE: Maximum BPT allowed: 30%
  const _absMaxBpt = useMemo(() => {
    const poolMax = bnum(poolTotalShares)
      .times(0.3)
      .toFixed(POOL_DECIMALS, BigNumber.ROUND_DOWN)
    return BigNumber.min(bptBalance, poolMax).toString()
  }, [bptBalance, poolTotalShares])

  const _propBptIn = useCallback(
    (percent: number) =>
      formatUnits(
        parseUnits(bptBalance, POOL_DECIMALS)
          .mul(percent)
          .div(100)
          .toString() || '0',
        POOL_DECIMALS
      ),
    [bptBalance]
  )

  const _propAmounts = useCallback(
    (percent: number) =>
      calculator?.propAmountsGiven(_propBptIn(percent), 0, 'send')?.receive ||
      _amountsOutPlaceholder,
    [_amountsOutPlaceholder, _propBptIn, calculator]
  )

  const calcAmountsOut = useCallback(
    ({ isProportional, tokenOutIndex, tokenOutAmount, percent }: Params) => {
      if (isProportional) return _propAmounts(percent)
      return poolTokens.map((_, i) => {
        if (i !== tokenOutIndex) return '0'
        return tokenOutAmount || '0'
      })
    },
    [_propAmounts, poolTokens]
  )

  const calcBptIn = useCallback(
    ({
      exactOut,
      isProportional,
      tokenOutIndex,
      tokenOutAmount,
      percent,
    }: Params) => {
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

  const singleAssetsMaxes = useMemo(() => {
    try {
      const _bptBalanceScaled =
        parseUnits(bptBalance, POOL_DECIMALS).toString() || '0'

      return poolTokens.map((token, tokenIndex) => {
        return formatUnits(
          calculator
            ?.exactBptInForTokenOut(_bptBalanceScaled, tokenIndex)
            .toString() || '0',
          token?.decimals || 18
        )
      })
    } catch (error) {
      return _amountsOutPlaceholder
    }
  }, [_amountsOutPlaceholder, bptBalance, calculator, poolTokens])

  const amountExceedsPoolBalance = useCallback(
    (tokenOutIndex: number, tokenOutAmount: string) => {
      return poolTokenBalances[tokenOutIndex]
        ? bnum(tokenOutAmount).gt(poolTokenBalances[tokenOutIndex])
        : false
    },
    [poolTokenBalances]
  )

  const calcPriceImpact = useCallback(
    (params: Params) => {
      const _amountsOut = calcAmountsOut(params)
      const { exactOut, isProportional, tokenOutIndex, tokenOutAmount } = params

      if (isProportional || !hasAmounts(_amountsOut)) return 0
      if (amountExceedsPoolBalance(tokenOutIndex, tokenOutAmount)) return 1

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
    [amountExceedsPoolBalance, calcAmountsOut, calcBptIn, calculator]
  )

  return {
    amountExceedsPoolBalance,
    calcAmountsOut,
    calcBptIn,
    calcPriceImpact,
    singleAssetsMaxes,
  }
}
