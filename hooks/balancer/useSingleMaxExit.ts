import { useCallback, useMemo } from 'react'
import { useAtomValue } from 'jotai'

import { slippageAtom } from 'states/system'
import { BalancerVaultAbi } from 'config/abi'
import { ExactInExitHandler } from 'lib/balancer/exactInExitHandler'
import { SingleMaxExitHandler } from 'lib/balancer/singleMaxExitHandler'
import { calcSlippageBsp } from 'utils/calcSlippageBsp'
import {
  useAuth,
  useBalances,
  useChain,
  useStaking,
  useViemClients,
} from 'hooks'
import { useBalancerSdk } from './useBalancerSdk'

export function useSingleMaxExit() {
  const { account } = useAuth()
  const balanceOf = useBalances()
  const { dexPoolId, dexProtocolAddress } = useChain()
  const { balancerSdk } = useBalancerSdk()
  const { lpToken, poolTokens, tokens } = useStaking()
  const { walletClient } = useViemClients()

  const userLpBalance = balanceOf(lpToken.address)

  const slippage = useAtomValue(slippageAtom) ?? '0.5'
  const slippageBsp = calcSlippageBsp(slippage)

  const singleMaxExitHandler = useMemo(() => {
    return balancerSdk
      ? new SingleMaxExitHandler(dexPoolId, poolTokens, tokens, balancerSdk)
      : null
  }, [balancerSdk, dexPoolId, poolTokens, tokens])

  const exitHandler = useMemo(() => {
    return balancerSdk
      ? new ExactInExitHandler(dexPoolId, poolTokens, tokens, balancerSdk)
      : null
  }, [balancerSdk, dexPoolId, poolTokens, tokens])

  const fetchSingleTokenExitMaxAmounts = useCallback(async () => {
    try {
      if (exitHandler == null) throw Error()
      if (!account) throw Error()

      const promises = poolTokens.map((t) =>
        exitHandler.queryExit({
          account,
          bptIn: userLpBalance,
          slippageBsp,
          assets: [t],
        })
      )

      const responses = await Promise.all(promises)

      return responses.map((res, i) => res.amountsOut[i])
    } catch (error) {
      throw error
    }
  }, [account, exitHandler, poolTokens, slippageBsp, userLpBalance])

  const querySingleMaxOut = useCallback(
    async (exitType: Hash) => {
      try {
        if (singleMaxExitHandler == null) throw Error()
        if (!account) throw Error()

        return await singleMaxExitHandler.queryExit({
          account,
          bptIn: userLpBalance,
          slippageBsp,
          tokenOut: exitType,
        })
      } catch (error) {
        throw error
      }
    },
    [account, singleMaxExitHandler, slippageBsp, userLpBalance]
  )

  const singleMaxExit = useCallback(
    async (exitType: Hash | null) => {
      if (singleMaxExitHandler == null) return
      if (exitType == null) return

      const exitParams = await querySingleMaxOut(exitType)

      const hash = await walletClient?.writeContract({
        address: dexProtocolAddress,
        abi: BalancerVaultAbi,
        functionName: 'exitPool',
        args: exitParams,
      })

      return hash
    },
    [dexProtocolAddress, querySingleMaxOut, singleMaxExitHandler, walletClient]
  )

  return {
    fetchSingleTokenExitMaxAmounts,
    singleMaxExit,
  }
}
