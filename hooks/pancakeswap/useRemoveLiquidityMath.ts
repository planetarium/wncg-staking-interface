import { useCallback, useMemo } from 'react'
import { CurrencyAmount } from '@pancakeswap/sdk'

import { formatUnits } from 'utils/formatUnits'
import { parseUnits } from 'utils/parseUnits'
import { bnum } from 'utils/bnum'
import { useBalances, useStaking } from 'hooks'
import { useFetchStaking } from 'hooks/queries'
import { useV2Pair } from './useV2Pair'

export function useRemoveLiquidityMath() {
  const balanceOf = useBalances()
  const { lpToken: initLpToken, poolTokenDecimals } = useStaking()
  const pair = useV2Pair()

  const { lpToken = initLpToken } = useFetchStaking().data ?? {}

  const totalLiquidity = useMemo(
    () =>
      CurrencyAmount.fromRawAmount(
        pair.liquidityToken,
        BigInt(parseUnits(lpToken.totalSupply, lpToken.decimals).toString())
      ),
    [lpToken.decimals, lpToken.totalSupply, pair.liquidityToken]
  )

  const userLpAmount = balanceOf(lpToken.address)

  const calcPropAmountsOut = useCallback(
    (pcnt: number | string) => {
      const propLpAmount = parseUnits(
        bnum(userLpAmount).times(pcnt).div(100).toString(),
        lpToken.decimals
      ).toString()

      const lpAmountOut = CurrencyAmount.fromRawAmount(
        pair.liquidityToken,
        propLpAmount
      )

      return [
        CurrencyAmount.fromRawAmount(
          pair.token0,
          pair.getLiquidityValue(
            pair.token0,
            totalLiquidity,
            lpAmountOut,
            false
          ).quotient
        ).quotient,
        CurrencyAmount.fromRawAmount(
          pair.token1,
          pair.getLiquidityValue(
            pair.token1,
            totalLiquidity,
            lpAmountOut,
            false
          ).quotient
        ).quotient,
      ].map((amt, i) => formatUnits(amt.toString(), poolTokenDecimals[i]))
    },
    [lpToken.decimals, pair, poolTokenDecimals, totalLiquidity, userLpAmount]
  )

  return calcPropAmountsOut
}
