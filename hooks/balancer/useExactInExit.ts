import { useCallback, useMemo } from 'react'
import { useAtomValue } from 'jotai'

import { useBalances } from 'hooks/useBalances'
import { useAuth } from 'hooks/useAuth'
import { useChain } from 'hooks/useChain'
import { useStaking } from 'hooks/useStaking'
import { ExactInExitHandler } from 'lib/balancer/exactInExitHandler'
import { useBalancerSdk } from './useBalancerSdk'
import { slippageAtom } from 'states/system'
import { calcSlippageBsp } from 'utils/calcSlippageBsp'
import { useViemClients } from 'hooks/useViemClients'
import { bnum } from 'utils/bnum'

export function useExactInExit() {
  const { account } = useAuth()
  const balanceOf = useBalances()
  const { balancerSdk } = useBalancerSdk()
  const { dexPoolId } = useChain()
  const { lpToken, poolTokens, tokens } = useStaking()
  const { walletClient } = useViemClients()

  const slippage = useAtomValue(slippageAtom) ?? '0.5'
  const slippageBsp = calcSlippageBsp(slippage)

  const userLpBalance = balanceOf(lpToken.address)

  const exitHandler = useMemo(() => {
    return balancerSdk
      ? new ExactInExitHandler(dexPoolId, poolTokens, tokens, balancerSdk)
      : null
  }, [balancerSdk, dexPoolId, poolTokens, tokens])

  const queryExactInExit = useCallback(
    async (bptPcnt: string) => {
      try {
        if (exitHandler == null) throw Error()
        if (!account) throw Error()

        return await exitHandler.queryExit({
          account,
          bptIn: bnum(userLpBalance).times(bptPcnt).div(100).toString(),
          slippageBsp,
          assets: poolTokens,
        })
      } catch (error) {
        throw error
      }
    },
    [account, exitHandler, poolTokens, slippageBsp, userLpBalance]
  )

  const queryExactOutExitMaxAmounts = useCallback(async () => {
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

  const exactInExit = useCallback(
    async (bptPcnt: string) => {
      if (exitHandler == null) return

      try {
        const { exitRes } = await queryExactInExit(bptPcnt)
        const hash = await walletClient?.sendTransaction(exitRes)
        return hash
      } catch (error) {
        throw error
      }
    },
    [exitHandler, queryExactInExit, walletClient]
  )

  return {
    exactInExit,
    queryExactInExit,
    queryExactOutExitMaxAmounts,
  }
}
