import { useMemo } from 'react'

import CalculatorService from 'services/calculator'
import { useBalances } from './useBalances'
import { usePool } from './usePool'

export function useCalculator(action: PoolAction) {
  const { bptBalance } = useBalances()
  const { pool } = usePool()

  const calculator = useMemo(() => {
    if (!pool) return null
    return new CalculatorService(pool, bptBalance, action)
  }, [action, bptBalance, pool])

  return calculator
}
