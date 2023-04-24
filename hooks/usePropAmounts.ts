import { useMemo } from 'react'

import { useCalculator, useFiat, useStaking } from 'hooks'

export function usePropAmounts(amount: string) {
  const calculator = useCalculator('exit')
  const toFiat = useFiat()
  const { poolTokenAddresses } = useStaking()

  const propAmounts = useMemo(
    () => calculator?.propAmountsGiven(amount, 0, 'send').receive || ['0', '0'],
    [amount, calculator]
  )

  const propAmountsInFiatValue = useMemo(
    () => propAmounts.map((amount, i) => toFiat(amount, poolTokenAddresses[i])),
    [poolTokenAddresses, propAmounts, toFiat]
  )

  return {
    propAmounts,
    propAmountsInFiatValue,
  }
}
