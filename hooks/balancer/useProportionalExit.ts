import { useAtomValue } from 'jotai'
import { useCallback } from 'react'

import {
  BalancerApi,
  ChainId,
  InputAmount,
  RemoveLiquidity,
  RemoveLiquidityKind,
  RemoveLiquidityProportionalInput,
  Slippage,
} from '@balancer/sdk'
import {
  useAuth,
  useBalances,
  useChain,
  useStaking,
  useViemClients,
} from 'hooks'
import { rpcUrlFor } from 'lib/wagmi/rpcUrlFor'
import { slippageAtom } from 'states/system'
import { bnum } from 'utils/bnum'

export function useProportionalExit() {
  const { account } = useAuth()
  const { dexPoolId, chainId, chain } = useChain()
  const { lpToken } = useStaking()
  const { walletClient } = useViemClients()
  const balanceOf = useBalances()

  const slippage = useAtomValue(slippageAtom) ?? '0.5'

  const userLpBalance = balanceOf(lpToken.address)

  const getPoolState = useCallback(async () => {
    if (!dexPoolId || !chainId || !chain) return
    const balancerApi = new BalancerApi(
      'https://api-v3.balancer.fi/',
      chainId as ChainId
    )
    return await balancerApi.pools.fetchPoolState(dexPoolId)
  }, [chainId, dexPoolId])

  const exitPoolPreview = async (percent: string) => {
    try {
      const poolState = await getPoolState()
      if (!account || !poolState) throw Error()

      const amount = BigInt(
        BigInt(
          bnum(userLpBalance)
            .times(10 ** lpToken.decimals)
            .times(percent)
            .div(100)
            .toFixed(0)
        )
      )

      const bptIn: InputAmount = {
        rawAmount: amount,
        decimals: 18,
        address: poolState.address,
      }

      const removeLiquidityInput: RemoveLiquidityProportionalInput = {
        chainId,
        rpcUrl: rpcUrlFor(chain.network)!.http,
        bptIn,
        kind: RemoveLiquidityKind.Proportional,
      }

      const removeLiquidity = new RemoveLiquidity()
      const queryOutput = await removeLiquidity.query(
        removeLiquidityInput,
        poolState
      )

      return queryOutput
    } catch (error) {
      throw error
    }
  }

  const exitPool = async (percent: string) => {
    try {
      const poolState = await getPoolState()
      if (!account || !poolState || !walletClient) throw Error()

      const amount = BigInt(
        BigInt(
          bnum(userLpBalance)
            .times(10 ** lpToken.decimals)
            .times(percent)
            .div(100)
            .toFixed(0)
        )
      )

      const bptIn: InputAmount = {
        rawAmount: amount,
        decimals: 18,
        address: poolState.address,
      }

      const removeLiquidityInput: RemoveLiquidityProportionalInput = {
        chainId,
        rpcUrl: rpcUrlFor(chain.network)!.http,
        bptIn,
        kind: RemoveLiquidityKind.Proportional,
      }

      const removeLiquidity = new RemoveLiquidity()
      const queryOutput = await removeLiquidity.query(
        removeLiquidityInput,
        poolState
      )

      const call = removeLiquidity.buildCall({
        ...queryOutput,
        slippage: Slippage.fromPercentage(slippage),
        chainId,
        sender: account,
        recipient: account,
      })

      const hash = await walletClient.sendTransaction({
        account: account,
        data: call.callData,
        to: call.to,
        value: call.value,
      })

      return hash
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  return { exitPoolPreview, exitPool }
}
