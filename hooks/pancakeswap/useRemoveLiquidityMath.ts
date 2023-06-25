import { useCallback, useMemo } from 'react'
import { bnum } from 'utils/bnum'

import { formatUnits } from 'utils/formatUnits'
import { useBalances, useStaking } from 'hooks'
import { useFetchPool } from 'hooks/queries'

export function useRemoveLiquidityMath() {
  const balanceOf = useBalances()
  const { lpToken: initLpToken, poolReserves: initPoolReserves } = useStaking()

  const { lpToken = initLpToken, poolReserves = initPoolReserves } =
    useFetchPool({ refetchOnWindowFocus: 'always' }).data ?? {}

  const userLpAmount = useMemo(
    () => balanceOf(lpToken.address),
    [balanceOf, lpToken.address]
  )

  const calcPropAmountsOut = useCallback(
    (pcnt: number | string) => {
      const lpAmountOut = bnum(userLpAmount).times(pcnt).div(100)

      const share = lpAmountOut.div(lpToken.totalSupply)
      return poolReserves.map((amt) => share.times(amt).toFixed(0, 3))
    },
    [userLpAmount, lpToken.totalSupply, poolReserves]
  )

  return calcPropAmountsOut
}
