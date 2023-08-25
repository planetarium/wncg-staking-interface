import { useCallback, useMemo } from 'react'
import { readContract } from '@wagmi/core'

import { PancakeRouterAbi } from 'config/abi'
import { BASE_GAS_FEE } from 'config/constants/liquidityPool'
import { bnum } from 'utils/bnum'
import { formatUnits } from 'utils/formatUnits'
import { parseUnits } from 'utils/parseUnits'
import { useBalances, useChain, useFiat, useStaking } from 'hooks'
import { useFetchStaking } from 'hooks/queries'

export function useAddLiquidityMath(isNative?: boolean) {
  const balanceOf = useBalances()
  const { dexProtocolAddress, nativeCurrency } = useChain()
  const toFiat = useFiat()
  const {
    poolTokenAddresses,
    poolTokenDecimals,
    poolTokenBalances: initPoolTokenBalances,
  } = useStaking()

  const { poolTokenBalances = initPoolTokenBalances } =
    useFetchStaking().data ?? {}

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

  const calcPropAmountIn = useCallback(
    async (amountIn: string, amountInIndex: number) => {
      try {
        const data = (await readContract({
          address: dexProtocolAddress,
          abi: PancakeRouterAbi as Abi,
          functionName: 'quote',
          args: [
            parseUnits(amountIn, poolTokenDecimals[amountInIndex]).toString(),
            parseUnits(
              poolTokenBalances[amountInIndex],
              poolTokenDecimals[amountInIndex]
            ).toString(),
            parseUnits(
              poolTokenBalances[1 - amountInIndex],
              poolTokenDecimals[1 - amountInIndex]
            ).toString(),
          ],
        })) as BigNumber

        const dependentAmountIn = formatUnits(
          data,
          poolTokenDecimals[1 - amountInIndex]
        )

        const optAmountsIn = []
        optAmountsIn[amountInIndex] = amountIn
        optAmountsIn[1 - amountInIndex] = dependentAmountIn

        return dependentAmountIn
      } catch (error: any) {
        return '0'
      }
    },
    [dexProtocolAddress, poolTokenBalances, poolTokenDecimals]
  )

  const calcOptimizedAmounts = useCallback(async () => {
    const promises = maxSafeBalances.map((amt, i) => calcPropAmountIn(amt, i))

    try {
      const responses = (await Promise.all(promises)) as string[]
      const amountsInPairs = maxSafeBalances.map((amt, i) => {
        return i === 0 ? [amt, responses[i]] : [responses[i], amt]
      })

      const feasibleAmountsInPairs = amountsInPairs.filter((pair) =>
        maxBalances.every(
          (amt, i) => bnum(pair[i]).gt(0) && bnum(pair[i]).lte(amt)
        )
      )

      if (!feasibleAmountsInPairs.length) return null
      if (feasibleAmountsInPairs.length === 1) return feasibleAmountsInPairs[0]

      const pairSumValues = feasibleAmountsInPairs.map((pair) => {
        return pair.reduce((acc, amt, i) => {
          return acc.plus(toFiat(amt, assets[i]))
        }, bnum(0))
      })

      pairSumValues.sort((a, b) => b.minus(a.toString()).toNumber())
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
