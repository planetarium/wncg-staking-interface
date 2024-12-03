import {
  AddLiquidity,
  AddLiquidityInput,
  AddLiquidityKind,
  InputAmount,
  PriceImpact,
  Slippage,
  isSameAddress,
} from '@balancer/sdk'
import { useAtomValue } from 'jotai'
import { parseEther } from 'viem'
import { useMemo } from 'react'

import { MIN_TRANSFER_BUFFER } from 'config/misc'
import { useAuth, useBalances, useChain, useStaking, useViemClients } from 'hooks'
import { rpcUrlFor } from 'lib/wagmi/rpcUrlFor'
import { slippageAtom } from 'states/system'
import { useBalancerApi } from './useBalancerApi'
import { CalcPropJoinHandler } from 'lib/balancer/calcPropJoinHandler'
import { bnum } from 'utils/bnum'

export function useJoinPool(isNative: boolean) {
  const { account } = useAuth()
  const balanceOf = useBalances()
  const { chain, chainId, nativeCurrency } = useChain()
  const { walletClient } = useViemClients()
  const { getPoolState } = useBalancerApi()
  const { poolTokens, tokens } = useStaking()
  const slippage = useAtomValue(slippageAtom) ?? '0.5'

  const assets = useMemo(() => {
    return poolTokens.map((t) => {
      if (!isNative) return t.address
      if (t.address !== nativeCurrency.wrappedTokenAddress) return t.address
      return nativeCurrency.address
    })
  }, [isNative, nativeCurrency, poolTokens])

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

  const getPriceImpact = async (amountsIn: `${number}`[]) => {
    try {
      const poolState = await getPoolState()
      if (!poolState || !chain) return

      const inputAmounts: InputAmount[] = poolState.tokens.map((token, idx) => ({
        ...token,
        rawAmount: parseEther(amountsIn[idx]),
      }))

      const addLiquidityInput: AddLiquidityInput = {
        amountsIn: inputAmounts,
        chainId,
        rpcUrl: rpcUrlFor(chain.network)!.http,
        kind: AddLiquidityKind.Unbalanced,
      }

      return await PriceImpact.addLiquidityUnbalanced(
        addLiquidityInput,
        poolState
      )
    } catch (error) {
      throw error
    }
  }

  const joinPool = async (amountsIn: `${number}`[]) => {
    try {
      if (!account || !walletClient) throw Error('No account')

      const poolState = await getPoolState()
      if (!poolState || !chain) return

      const inputAmounts: InputAmount[] = poolState.tokens.map((token, idx) => ({
        ...token,
        rawAmount: parseEther(amountsIn[idx]),
      }))

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

      const call = addLiquidity.buildCall({
        ...queryOutput,
        slippage: Slippage.fromPercentage(slippage),
        wethIsEth: isNative,
        sender: account,
        recipient: account,
      })

      const hash = await walletClient.sendTransaction({
        account,
        data: call.callData,
        to: call.to,
        value: call.value,
      })

      return hash
    } catch (error) {
      throw error
    }
  }

  return {
    joinPool,
    getPriceImpact,
    calcPropAmountsIn: calcPropJoinHandler.calcPropAmountsIn,
    optimizedAmountsIn,
    maxBalances,
    maxSafeBalances,
    assets,
  }
}
