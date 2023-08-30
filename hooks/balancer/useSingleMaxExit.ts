import { useCallback, useMemo } from 'react'
import { useAtomValue } from 'jotai'

import { slippageAtom } from 'states/system'
import { ExactInExitHandler } from 'lib/balancer/exactInExitHandler'
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
  const { dexPoolId } = useChain()
  const { balancerSdk } = useBalancerSdk()
  const { lpToken, poolTokens, tokens } = useStaking()
  const { walletClient } = useViemClients()

  const userLpBalance = balanceOf(lpToken.address)

  const slippage = useAtomValue(slippageAtom) ?? '0.5'
  const slippageBsp = calcSlippageBsp(slippage)

  const exitHandler = useMemo(() => {
    return balancerSdk
      ? new ExactInExitHandler(dexPoolId, poolTokens, tokens, balancerSdk)
      : null
  }, [balancerSdk, dexPoolId, poolTokens, tokens])

  const querySingleTokenExitMaxAmounts = useCallback(async () => {
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

  return {
    querySingleTokenExitMaxAmounts,
  }
}
