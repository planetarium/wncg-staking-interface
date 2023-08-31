import { useCallback, useMemo } from 'react'
import { isSameAddress } from '@balancer-labs/sdk'

import { MIN_TRANSFER_BUFFER } from 'config/misc'
import { CalcPropJoinHandler } from 'lib/balancer/calcPropJoinHandler'
import { ExactInJoinHandler } from 'lib/balancer/exactInJoinHandler'
import type { JoinParams } from 'lib/balancer/types'
import { bnum } from 'utils/bnum'
import { useBalances, useChain, useStaking, useViemClients } from 'hooks'
import { useBalancerSdk } from './useBalancerSdk'

export function useJoinMath(isNative: boolean) {
  const balanceOf = useBalances()
  const { chainId, dexPoolId, nativeCurrency } = useChain()
  const { poolTokens, tokens } = useStaking()
  const { balancerSdk } = useBalancerSdk()
  const { walletClient } = useViemClients()

  const assets = useMemo(() => {
    return poolTokens.map((t) => {
      if (!isNative) return t.address
      if (t.address !== nativeCurrency.wrappedTokenAddress) return t.address
      return nativeCurrency.address
    })
  }, [
    isNative,
    nativeCurrency.address,
    nativeCurrency.wrappedTokenAddress,
    poolTokens,
  ])

  const maxBalances = useMemo(
    () => assets.map((addr) => balanceOf(addr)),
    [assets, balanceOf]
  )

  const maxSafeBalances = useMemo(
    () =>
      maxBalances.map((b, i) => {
        if (!isSameAddress(assets[i], nativeCurrency.address)) {
          return b
        }

        const safeBalance = bnum(b).minus(MIN_TRANSFER_BUFFER)
        return safeBalance.gt(0) ? safeBalance.toString() : '0'
      }),
    [maxBalances, assets, nativeCurrency.address]
  )

  const calcPropJoinHandler = useMemo(() => {
    return new CalcPropJoinHandler(
      chainId,
      poolTokens,
      tokens,
      isNative,
      maxSafeBalances
    )
  }, [chainId, isNative, maxSafeBalances, poolTokens, tokens])

  const optimizedAmountsIn = useMemo(
    () => calcPropJoinHandler.propMaxAmountsIn,
    [calcPropJoinHandler.propMaxAmountsIn]
  )

  const joinHandler = useMemo(
    () =>
      balancerSdk
        ? new ExactInJoinHandler(dexPoolId, tokens, balancerSdk)
        : null,
    [balancerSdk, dexPoolId, tokens]
  )

  const queryJoin = useCallback(
    async (params: JoinParams) => {
      if (joinHandler == null) return

      try {
        return await joinHandler.queryJoin(params)
      } catch (error) {
        throw error
      }
    },
    [joinHandler]
  )

  const join = useCallback(
    async (params: JoinParams) => {
      if (joinHandler == null) return

      try {
        const { joinRes } = await joinHandler.queryJoin(params)
        const hash = await walletClient?.sendTransaction(joinRes)
        return hash
      } catch (error) {
        throw error
      }
    },
    [joinHandler, walletClient]
  )

  return {
    calcPropAmountsIn: calcPropJoinHandler.calcPropAmountsIn,
    queryJoin,
    optimizedAmountsIn,
    join,
    maxBalances,
    maxSafeBalances,
  }
}
