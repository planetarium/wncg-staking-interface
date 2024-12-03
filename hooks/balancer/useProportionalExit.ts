import { useAtomValue } from 'jotai'

import {
  InputAmount,
  RemoveLiquidity,
  RemoveLiquidityKind,
  RemoveLiquidityProportionalInput,
  Slippage,
} from '@balancer/sdk'
import { useAuth, useChain, useStaking, useViemClients } from 'hooks'
import { rpcUrlFor } from 'lib/wagmi/rpcUrlFor'
import { slippageAtom } from 'states/system'
import { parseUnits } from 'viem'
import { useBalancerApi } from './useBalancerApi'

export function useProportionalExit() {
  const { account } = useAuth()
  const { chainId, chain } = useChain()
  const { lpToken } = useStaking()
  const { walletClient } = useViemClients()
  const { getPoolState } = useBalancerApi()

  const slippage = useAtomValue(slippageAtom) ?? '0.5'

  const exitPoolPreview = async (amountIn: `${number}`) => {
    try {
      const poolState = await getPoolState()
      if (!account || !poolState) throw Error()

      const amount = parseUnits(amountIn, lpToken.decimals)

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

  const exitPool = async (amountIn: `${number}`, isWeth: boolean) => {
    try {
      const poolState = await getPoolState()
      if (!account || !poolState || !walletClient) throw Error()

      const amount = parseUnits(amountIn, lpToken.decimals)

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
        wethIsEth: isWeth,
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
