import { useCallback, useMemo } from 'react'
import { useAtomValue } from 'jotai'

import { slippageAtom } from 'states/system'
import { ExactInExitHandler } from 'lib/balancer/exactInExitHandler'
import { calcSlippageBsp } from 'utils/calcSlippageBsp'
import { bnum } from 'utils/bnum'
import {
  useAuth,
  useBalances,
  useChain,
  useStaking,
  useViemClients,
} from 'hooks'
import { useBalancerSdk } from './useBalancerSdk'

export function useExactInExit() {
  const { account } = useAuth()
  const { balancerSdk } = useBalancerSdk()
  const { dexPoolId } = useChain()
  const { lpToken, poolTokens, tokens } = useStaking()
  const { walletClient } = useViemClients()
  const balanceOf = useBalances()

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
  }
}
