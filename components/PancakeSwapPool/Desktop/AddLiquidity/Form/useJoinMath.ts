import { useCallback, useMemo } from 'react'
import { useAtomValue } from 'jotai'

import { priceMapAtom } from 'states/system'
import { BASE_GAS_FEE } from 'config/constants/liquidityPool'
import { bnum } from 'utils/bnum'
import { removeTrailingZero } from 'utils/removeTrailingZero'
import { useBalances, useChain, useFiat, useStaking } from 'hooks'

type CalcParams = {
  currentTokenAddress: Hash
  amount: string
  subjectTokenAddress: Hash
}

export function useJoinMath() {
  const balanceOf = useBalances()
  const { nativeCurrency } = useChain()
  const toFiat = useFiat()
  const { poolTokenAddresses } = useStaking()

  const priceMap = useAtomValue(priceMapAtom)

  const maxBalances = useMemo(
    () => poolTokenAddresses.map((addr) => balanceOf(addr)),
    [balanceOf, poolTokenAddresses]
  )

  const maxSafeBalances = useMemo(
    () =>
      maxBalances.map((amt, i) => {
        const address = poolTokenAddresses[i]
        if (address !== nativeCurrency.address) return amt

        const safeBalance = bnum(amt).minus(BASE_GAS_FEE)
        return safeBalance.gt(0) ? safeBalance.toString() : '0'
      }),
    [maxBalances, nativeCurrency.address, poolTokenAddresses]
  )

  const calcPropAmount = useCallback(
    ({ currentTokenAddress, amount, subjectTokenAddress }: CalcParams) => {
      if (bnum(amount).isZero()) return ''

      try {
        const currentFiatValue = toFiat(amount, currentTokenAddress)
        const subjectTokenAmount = bnum(currentFiatValue)
          .div(priceMap[subjectTokenAddress]!)
          .toFixed(18, 3)
        return removeTrailingZero(subjectTokenAmount)
      } catch (error) {
        return
      }
    },
    [priceMap, toFiat]
  )

  const optimizeUnavailable = useMemo(() => {
    switch (true) {
      case maxBalances.every((amount) => bnum(amount).isZero()):
        return 'all'
      case maxBalances.every((amount) => bnum(amount).gt(0)):
        return null
      default:
        return maxBalances.findIndex((amount) => bnum(amount).isZero())
    }
  }, [maxBalances])

  const _optimizedAmounts = useMemo(() => {
    if (optimizeUnavailable) return [['', '']]

    return maxSafeBalances.flatMap((balance, i) => {
      const counterIndex = 1 - i
      balance = bnum(balance).isZero() ? maxBalances[i] : balance

      const propAmount =
        calcPropAmount({
          currentTokenAddress: poolTokenAddresses[i],
          amount: balance,
          subjectTokenAddress: poolTokenAddresses[counterIndex],
        }) ?? '0'

      if (bnum(propAmount).gt(maxBalances[counterIndex])) return []

      const result = []
      result[i] = balance
      result[counterIndex] = propAmount

      return [result]
    })
  }, [
    calcPropAmount,
    maxBalances,
    maxSafeBalances,
    optimizeUnavailable,
    poolTokenAddresses,
  ])

  const optimizedAmounts = useMemo(() => {
    switch (_optimizedAmounts.length) {
      case 1:
        return _optimizedAmounts[0]
      case 2:
        return (
          _optimizedAmounts.find((amts) => {
            return amts.every(
              (amt, i) =>
                bnum(amt).lte(maxSafeBalances[i]) && !bnum(amt).isZero()
            )
          }) ??
          _optimizedAmounts.find((amts) => {
            return amts.every(
              (amt, i) => bnum(amt).lte(maxBalances[i]) && !bnum(amt).isZero()
            )
          }) ?? ['', '']
        )

      default:
        return ['', '']
    }
  }, [_optimizedAmounts, maxBalances, maxSafeBalances])

  return {
    maxBalances,
    maxSafeBalances,
    calcPropAmount,
    optimizedAmounts,
    optimizeUnavailable,
  }
}
