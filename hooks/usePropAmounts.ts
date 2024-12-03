import { useMemo } from 'react'

import { useFiat, useStaking } from 'hooks'
import { useQuery } from 'wagmi'
import { QUERY_KEYS } from 'config/constants/queryKeys'
import { useProportionalExit } from './balancer'
import { formatUnits } from 'viem'
import { bnum } from 'utils/bnum'

export function usePropAmounts(amount: string) {
  const { poolTokenAddresses } = useStaking()

  const { exitPoolPreview } = useProportionalExit()

  const { data } = useQuery<`${number}`[]>(
    [QUERY_KEYS.Balancer.Proportional, amount],
    async () => {
      const { amountsOut } = await exitPoolPreview(amount as `${number}`)
      const receive: `${number}`[] = amountsOut.map(
        ({ amount: _amount, token }) =>
          formatUnits(_amount, token.decimals) as `${number}`
      )
      return receive
    },
    {
      keepPreviousData: true,
      useErrorBoundary: false,
      suspense: false,
    }
  )
  const propAmounts = data ?? []

  const toFiat = useFiat()

  const propAmountsInFiatValue = useMemo(() => {
    return propAmounts.map((amount, i) => {
      return toFiat(amount, poolTokenAddresses[i]) as `${number}`
    })
  }, [propAmounts, poolTokenAddresses, toFiat])

  const totalPropAmountsInFiatValue = useMemo(() => {
    return propAmountsInFiatValue
      .reduce((acc, amount) => {
        return acc.plus(amount)
      }, bnum(0))
      .toString() as `${number}`
  }, [propAmountsInFiatValue])

  return {
    propAmounts,
    propAmountsInFiatValue,
    totalPropAmountsInFiatValue,
  }
}
