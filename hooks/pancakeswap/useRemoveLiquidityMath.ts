import { useCallback, useMemo } from 'react'
import { bnum } from 'utils/bnum'

import { useBalances, useStaking } from 'hooks'
import { useFetchStaking } from 'hooks/queries'

export function useRemoveLiquidityMath() {
  const balanceOf = useBalances()
  const { lpToken, poolTokenBalances: initPoolTokenBalances } = useStaking()

  const { poolTokenBalances = initPoolTokenBalances } =
    useFetchStaking().data ?? {}

  const userLpAmount = useMemo(
    () => balanceOf(lpToken.address),
    [balanceOf, lpToken?.address]
  )

  const calcPropAmountsOut = useCallback(
    (pcnt: number | string) => {
      const lpAmountOut = bnum(userLpAmount).times(pcnt).div(100)

      const share = lpAmountOut.div(lpToken?.totalSupply)
      return poolTokenBalances.map((amt) => share.times(amt).toFixed(18, 3))
    },
    [userLpAmount, lpToken?.totalSupply, poolTokenBalances]
  )

  return calcPropAmountsOut
}
