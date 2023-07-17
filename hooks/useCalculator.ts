import { useMemo } from 'react'

import CalculatorService from 'services/calculator'
import { useChain } from './useChain'
import { useBalances } from './useBalances'
import { useStaking } from './useStaking'

export function useCalculator(action: PoolAction) {
  const balanceOf = useBalances()
  const { chainId } = useChain()
  const { lpToken, totalSwapFee, poolTokens } = useStaking()

  const userLpBalance = balanceOf(lpToken?.address)

  const pool = useMemo(
    () => ({
      address: lpToken?.address,
      symbol: lpToken?.symbol,
      name: lpToken?.name,
      totalShares: lpToken?.totalSupply,
      totalSwapFee,
      tokens: poolTokens,
    }),
    [
      lpToken?.address,
      lpToken?.name,
      lpToken?.symbol,
      lpToken?.totalSupply,
      poolTokens,
      totalSwapFee,
    ]
  )

  const calculator = useMemo(() => {
    if (!pool) return null
    return new CalculatorService(chainId, pool, userLpBalance, action)
  }, [pool, chainId, userLpBalance, action])

  return calculator
}
