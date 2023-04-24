import { useMemo } from 'react'

import CalculatorService from 'services/calculator'
import { useBalances } from './useBalances'
import { useStaking } from './useStaking'

export function useCalculator(action: PoolAction) {
  const balanceOf = useBalances()
  const { bptAddress, pool } = useStaking()

  const bptBalance = balanceOf(bptAddress)

  const calculator = useMemo(() => {
    if (!pool) return null
    return new CalculatorService(pool, bptBalance, action)
  }, [action, bptBalance, pool])

  return calculator
}
