import { useMemo } from 'react'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import OldBigNumber from 'bignumber.js'

import { POOL_DECIMALS } from 'constants/tokens'
import { bnum, hasAmounts } from 'utils/num'
import { useBalances } from './useBalances'
import { useCalculator } from './useCalculator'
import { usePool } from './usePool'
import { useSlippage } from './useSlippage'

export function useExitMath(
  isProportional: boolean,
  tokenOutIndex = 0,
  tokenOutAmount = '0'
) {
  const { bptBalance } = useBalances()
  const calculator = useCalculator('exit')
  const { poolTokens, poolTotalShares } = usePool()
  const { addSlippageScaled, minusSlippage } = useSlippage()

  const exactOut = !isProportional
  const _poolMax = bnum(poolTotalShares)
    .times(0.3)
    .toFixed(POOL_DECIMALS, OldBigNumber.ROUND_DOWN)
  const absMaxBpt = OldBigNumber.min(bptBalance, _poolMax).toString()

  const _tokenOutPoolBalance = poolTokens[tokenOutIndex]?.balance || '0'
  const amountExceedsPoolBalance = bnum(tokenOutAmount).gt(_tokenOutPoolBalance)

  const _fullAmounts = useMemo(() => {
    return isProportional
      ? calculator?.propAmountsGiven(bptBalance, 0, 'send')?.receive || [
          '0',
          '0',
        ]
      : poolTokens.map((_, i) => {
          if (i !== tokenOutIndex) return '0'
          return tokenOutAmount || '0'
        })
  }, [
    bptBalance,
    calculator,
    isProportional,
    poolTokens,
    tokenOutAmount,
    tokenOutIndex,
  ])
  const amountsOut = _fullAmounts.map((amount, i) => {
    // if (amount === '0' || exactOut) return amount
    return amount
    // return minusSlippage(amount, poolTokens[i]?.decimals || 18)
  })

  const _fullBptIn = isProportional
    ? parseUnits(bptBalance, POOL_DECIMALS).toString()
    : exactOut
    ? parseUnits(absMaxBpt, POOL_DECIMALS).toString()
    : calculator
        ?.bptInForExactTokenOut(tokenOutAmount, tokenOutIndex)
        .toString() || '0'
  const bptIn = exactOut ? addSlippageScaled(_fullBptIn) : _fullBptIn

  const singleAssetsMaxes = useMemo(() => {
    try {
      const _bptBalanceScaled = parseUnits(bptBalance, POOL_DECIMALS).toString()
      return poolTokens.map((token, tokenIndex) => {
        const maxTokenOut =
          calculator
            ?.exactBptInForTokenOut(_bptBalanceScaled, tokenIndex)
            .toString() || '0'
        return formatUnits(maxTokenOut, token?.decimals || 18)
      })
    } catch (error) {
      return []
    }
  }, [bptBalance, calculator, poolTokens])

  const priceImpact = useMemo(() => {
    if (amountExceedsPoolBalance) return 1
    if (isProportional || !hasAmounts(_fullAmounts)) return 0

    try {
      return (
        calculator
          ?.priceImpact(_fullAmounts, {
            exactOut,
            tokenIndex: tokenOutIndex,
            queryBpt: bnum(_fullBptIn),
          })
          .toNumber() || 0
      )
    } catch (error) {
      return 1
    }
  }, [
    _fullAmounts,
    _fullBptIn,
    amountExceedsPoolBalance,
    calculator,
    exactOut,
    isProportional,
    tokenOutIndex,
  ])

  return {
    amountExceedsPoolBalance,
    amountsOut,
    bptIn,
    priceImpact,
    singleAssetsMaxes,
  }
}
