import { useMemo } from 'react'

import CalculatorService from 'services/calculator'
import { useBalances } from './useBalances'
import { usePoolService } from './usePoolService'

export function useCalculator(action: PoolAction) {
  const { bptAddress, pool } = usePoolService()
  const { balanceFor } = useBalances()

  const bptBalance = balanceFor(bptAddress)

  const calculator = useMemo(() => {
    if (!pool) return null
    return new CalculatorService(pool, bptBalance, action)
  }, [action, bptBalance, pool])

  return calculator
}
