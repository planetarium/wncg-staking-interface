import { useCallback, useMemo } from 'react'
import BigNumber from 'bignumber.js'

import { formatUnits } from 'utils/formatUnits'
import { bnum } from 'utils/bnum'
import { hasAmounts } from 'utils/hasAmounts'
import { parseUnits } from 'utils/parseUnits'
import { useBalances, useCalculator, useSlippage, useStaking } from 'hooks'

type ExitMathParams = {
  exactOut: boolean
  isProportional: boolean
  tokenOutIndex: number
  tokenOutAmount: string
  bptOutPcnt: string
}

export function useExitMath() {
  const balancesFor = useBalances()
  const calculator = useCalculator('exit')
  const { lpToken, poolTokenAddresses, poolTokenBalances, poolTokenDecimals } =
    useStaking()
  const { addSlippageScaled, minusSlippage } = useSlippage()

  const lpBalance = balancesFor(lpToken.address)

  const amountsOutPlaceholder = useMemo(
    () => poolTokenAddresses.map((_) => '0') ?? [],
    [poolTokenAddresses]
  )

  const singleExitMaxAmounts = useMemo(() => {
    try {
      const _lpBalanceScaled = parseUnits(lpBalance).toString()

      return poolTokenDecimals.map((decimals, i) => {
        return minusSlippage(
          formatUnits(
            calculator?.exactBptInForTokenOut(_lpBalanceScaled, i),
            decimals ?? 18
          ),
          decimals
        )
      })
    } catch (error) {
      return amountsOutPlaceholder
    }
  }, [
    minusSlippage,
    amountsOutPlaceholder,
    lpBalance,
    calculator,
    poolTokenDecimals,
  ])

  // NOTE: Maximum BPT allowed: 30%
  const _absMaxBpt = useMemo(() => {
    const poolMax = bnum(lpToken.totalSupply)
      .times(0.3)
      .toFixed(18, BigNumber.ROUND_DOWN)
    return BigNumber.min(lpBalance, poolMax).toString()
  }, [lpBalance, lpToken.totalSupply])

  const _propBptIn = useCallback(
    (pcnt: string) => bnum(lpBalance).times(pcnt).div(100).toString(),
    [lpBalance]
  )

  const _propAmounts = useCallback(
    (pcnt: string) =>
      calculator?.propAmountsGiven(_propBptIn(pcnt), 0, 'send')?.receive ??
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
    ({
      exactOut,
      isProportional,
      tokenOutAmount,
      tokenOutIndex,
      bptOutPcnt,
    }: ExitMathParams) => {
      let _bptIn: string

      if (isProportional) {
        _bptIn = parseUnits(_propBptIn(bptOutPcnt)).toString()
      } else if (!exactOut) {
        _bptIn = parseUnits(_absMaxBpt).toString()
      } else {
        _bptIn =
          calculator
            ?.bptInForExactTokenOut(tokenOutAmount, tokenOutIndex)
            .toString() ?? '0'
      }

      if (exactOut) return addSlippageScaled(_bptIn)
      return _bptIn
    },
    [_absMaxBpt, _propBptIn, addSlippageScaled, calculator]
  )

  const calcExitAmounts = useCallback(
    ({
      isProportional,
      tokenOutIndex,
      tokenOutAmount,
      bptOutPcnt,
    }: Omit<ExitMathParams, 'exactOut'>) => {
      if (isProportional) return _propAmounts(bptOutPcnt)

      return poolTokenAddresses.map((_, i) => {
        if (i !== tokenOutIndex) return '0'
        return bnum(tokenOutAmount).toString() ?? '0'
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
            .toNumber() ?? 0
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
