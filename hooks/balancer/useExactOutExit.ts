import { useCallback, useMemo } from 'react'
import { useAtomValue } from 'jotai'

import { slippageAtom } from 'states/system'
import { ExactOutExitHandler } from 'lib/balancer/exactOutExitHandler'
import { bnum } from 'utils/bnum'
import { calcSlippageBsp } from 'utils/calcSlippageBsp'
import { useAuth, useChain, useStaking, useViemClients } from 'hooks'
import { useBalancerSdk } from './useBalancerSdk'

export function useExactOutExit() {
  const { account } = useAuth()
  const { dexPoolId } = useChain()
  const { balancerSdk } = useBalancerSdk()
  const { poolTokens, tokens } = useStaking()
  const { walletClient } = useViemClients()

  const slippage = useAtomValue(slippageAtom) ?? '0.5'
  const slippageBsp = calcSlippageBsp(slippage)

  const exitHandler = useMemo(() => {
    return balancerSdk
      ? new ExactOutExitHandler(dexPoolId, poolTokens, tokens, balancerSdk)
      : null
  }, [balancerSdk, dexPoolId, poolTokens, tokens])

  const queryExactOutExit = useCallback(
    async (tokenOut: TokenInfo, amountOut: string) => {
      if (exitHandler == null) throw Error()
      if (!account) throw Error()

      if (bnum(amountOut).isZero()) {
        return {
          priceImpact: 0,
          amountsOut: ['0'],
          exitRes: null,
        }
      }

      try {
        const result = await exitHandler.queryExit({
          account,
          amountsOut: [amountOut],
          slippageBsp,
          assets: [tokenOut],
        })

        return result
      } catch (error) {
        throw error
      }
    },
    [account, exitHandler, slippageBsp]
  )

  const exactOutExit = useCallback(
    async (tokenOut: TokenInfo, amountOut: string) => {
      if (exitHandler == null) return

      try {
        const { exitRes } = await queryExactOutExit(tokenOut, amountOut)
        const hash = await walletClient?.sendTransaction(exitRes)
        return hash
      } catch (error) {
        throw error
      }
    },
    [exitHandler, queryExactOutExit, walletClient]
  )

  return {
    exactOutExit,
    queryExactOutExit,
  }
}
