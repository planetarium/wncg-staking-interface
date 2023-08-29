import { useCallback, useMemo } from 'react'

import { AddLiquidityField } from 'config/constants'
import { BASE_GAS_FEE } from 'config/constants/liquidityPool'
import { bnum } from 'utils/bnum'
import { useBalances, useChain, useFiat, useStaking } from 'hooks'
import { useMintMath } from './useMintMath'

export function useAddLiquidityMath(isNative?: boolean) {
  const balanceOf = useBalances()
  const { nativeCurrency } = useChain()
  const toFiat = useFiat()
  const { poolTokenAddresses } = useStaking()

  const calcPropAmountIn = useMintMath()

  const assets = useMemo(() => {
    return poolTokenAddresses.map((addr) => {
      if (!isNative) return addr
      if (addr !== nativeCurrency.wrappedTokenAddress) return addr
      return nativeCurrency.address
    })
  }, [
    isNative,
    nativeCurrency.address,
    nativeCurrency.wrappedTokenAddress,
    poolTokenAddresses,
  ])

  const maxBalances = useMemo(
    () => assets.map((addr) => balanceOf(addr)),
    [assets, balanceOf]
  )

  const maxSafeBalances = useMemo(
    () =>
      maxBalances.map((amt, i) => {
        if (assets[i] !== nativeCurrency.address) return amt
        return String(Math.max(bnum(amt).minus(BASE_GAS_FEE).toNumber(), 0))
      }),
    [assets, maxBalances, nativeCurrency.address]
  )

  const calcOptimizedAmounts = useCallback(async () => {
    const dependentAmounts = maxSafeBalances.map(
      (amt, i) =>
        calcPropAmountIn(
          i === 0 ? AddLiquidityField.TokenA : AddLiquidityField.TokenB,
          amt
        )?.toSignificant() ?? '0'
    )

    const amountsInPairs = maxSafeBalances.map((amt, i) => {
      return i === 0 ? [amt, dependentAmounts[i]] : [dependentAmounts[i], amt]
    })

    try {
      const feasiblePairs = amountsInPairs.filter((pair) =>
        maxBalances.every(
          (amt, i) => bnum(dependentAmounts[i]).gt(0) && bnum(pair[i]).lte(amt)
        )
      )

      if (!feasiblePairs.length) return null
      if (feasiblePairs.length === 1) return feasiblePairs[0]

      const feasiblePairSumValues = feasiblePairs.map((pair) =>
        pair.reduce((acc, amt, i) => acc.plus(toFiat(amt, assets[i])), bnum(0))
      )

      feasiblePairSumValues.sort((a, b) => b.minus(a.toString()).toNumber())
      return amountsInPairs[0]
    } catch (error: any) {
      return null
    }
  }, [assets, calcPropAmountIn, maxBalances, maxSafeBalances, toFiat])

  return {
    assets,
    calcPropAmountIn,
    calcOptimizedAmounts,
    maxBalances,
    maxSafeBalances,
  }
}
