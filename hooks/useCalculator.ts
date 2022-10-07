import { useMemo } from 'react'

import CalculatorService from 'services/calculator'
import { useBalances } from './useBalances'
import { usePool } from './usePool'

export function useCalculator(action: PoolAction) {
  const { balanceFor } = useBalances()
  const { bptAddress, pool } = usePool()

  const bptBalance = balanceFor(bptAddress)

  const calculator = useMemo(() => {
    if (!pool) return null
    return new CalculatorService(pool, bptBalance, action)
  }, [action, bptBalance, pool])

  return calculator
}
