import { useCalculator } from 'hooks'
import { useMemo } from 'react'

import { useBalances } from './useBalances'
import { useFiatCurrency } from './useFiatCurrency'
import { usePool } from './usePool'

export function usePropAmounts() {
  const { balanceFor } = useBalances()
  const calculator = useCalculator('exit')
  const { toFiat } = useFiatCurrency()
  const { bptAddress, poolTokenAddresses } = usePool()

  const bptBalance = balanceFor(bptAddress)

  const propAmounts = useMemo(
    () =>
      calculator?.propAmountsGiven(bptBalance, 0, 'send').receive || ['0', '0'],
    [bptBalance, calculator]
  )

  const propAmountsInFiatValue = useMemo(
    () => propAmounts.map((amount, i) => toFiat(poolTokenAddresses[i], amount)),
    [poolTokenAddresses, propAmounts, toFiat]
  )

  return {
    propAmounts,
    propAmountsInFiatValue,
  }
}
