import {
  AddLiquidity,
  AddLiquidityInput,
  AddLiquidityKind,
  BalancerApi,
  ChainId,
  InputAmount,
  isSameAddress,
  PriceImpact,
  Slippage,
} from '@balancer/sdk'
import { useCallback, useMemo } from 'react'

import { MIN_TRANSFER_BUFFER } from 'config/misc'
import { useBalances, useChain, useStaking, useViemClients } from 'hooks'
import { CalcPropJoinHandler } from 'lib/balancer/calcPropJoinHandler'
import type { JoinParams, PriceImpactParam } from 'lib/balancer/types'
import { rpcUrlFor } from 'lib/wagmi/rpcUrlFor'
import { bnum } from 'utils/bnum'
import { Address, parseEther } from 'viem'
import { useAccount } from 'wagmi'

export function useJoinMath(isNative: boolean) {
  const balanceOf = useBalances()
  const { chain, chainId, dexPoolId, nativeCurrency } = useChain()
  const { poolTokens, tokens } = useStaking()
  const { walletClient } = useViemClients()
  const { address } = useAccount()

  const getPoolState = useCallback(async () => {
    if (!dexPoolId || !chainId) return
    const balancerApi = new BalancerApi(
      'https://api-v3.balancer.fi/',
      chainId as ChainId
    )
    return await balancerApi.pools.fetchPoolState(dexPoolId)
  }, [chainId, dexPoolId])

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

  const getPriceImpact = useCallback(
    async (params: PriceImpactParam) => {
      const poolState = await getPoolState()
      if (!poolState || !chain) return
      try {
        const inputAmounts: InputAmount[] = poolState.tokens.map(
          (token, idx) => {
            return {
              ...token,
              rawAmount: parseEther(params.amountsIn[idx]),
            }
          }
        )

        const addLiquidityInput: AddLiquidityInput = {
          amountsIn: inputAmounts,
          chainId,
          rpcUrl: rpcUrlFor(chain.network)!.http,
          kind: AddLiquidityKind.Unbalanced,
        }

        const priceImpact = await PriceImpact.addLiquidityUnbalanced(
          addLiquidityInput,
          poolState
        )
        return priceImpact
      } catch (error) {
        throw error
      }
    },
    [getPoolState, chain]
  )

  const joinPool = useCallback(
    async (params: JoinParams) => {
      const poolState = await getPoolState()
      if (!poolState || !chain || !address) return

      try {
        const inputAmounts: InputAmount[] = poolState.tokens.map(
          (token, idx) => {
            return {
              ...token,
              address: token.address as Address,
              rawAmount: parseEther(params.amountsIn[idx]),
            }
          }
        )

        const addLiquidityInput: AddLiquidityInput = {
          amountsIn: inputAmounts,
          chainId,
          rpcUrl: rpcUrlFor(chain.network)!.http,
          kind: AddLiquidityKind.Unbalanced,
        }

        const addLiquidity = new AddLiquidity()
        const queryOutput = await addLiquidity.query(
          addLiquidityInput,
          poolState
        )

        const slippage = Slippage.fromPercentage(params.slippage) // 1%
        const call = addLiquidity.buildCall({
          ...queryOutput,
          slippage,
          wethIsEth: true,
          sender: address,
          recipient: address,
        })

        const hash = await walletClient?.sendTransaction({
          data: call.callData,
          to: call.to,
          value: call.value,
        })
        return hash
      } catch (error) {
        throw error
      }
    },
    [getPoolState, chain, address]
  )

  return {
    calcPropAmountsIn: calcPropJoinHandler.calcPropAmountsIn,
    getPriceImpact,
    optimizedAmountsIn,
    joinPool,
    maxBalances,
    maxSafeBalances,
  }
}
