import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  useAuth,
  useBalances,
  useChain,
  useStaking,
  useViemClients,
} from 'hooks'
import {
  ExactInExitHandler,
  QueryExactInExitParams,
} from 'lib/balancer/exactInExitHandler'
import { useBalancerSdk } from './useBalancerSdk'
import { ExitParams } from 'lib/balancer/types'
import { ExactOutExitHandler } from 'lib/balancer/exactOutExitHandler'
import { useAtomValue } from 'jotai'
import { slippageAtom } from 'states/system'
import { calcSlippageBsp } from 'utils/calcSlippageBsp'

export function useExitMath() {
  const [singleExitMaxAmounts, setSingleExitMaxAmounts] = useState<string[]>([])
  const { account } = useAuth()
  const balancesFor = useBalances()
  const { dexPoolId } = useChain()
  const { balancerSdk } = useBalancerSdk()
  const { lpToken, poolTokens, poolTokenAddresses, tokens } = useStaking()
  const { walletClient } = useViemClients()

  const slippage = useAtomValue(slippageAtom) ?? '0.5'
  const slippageBsp = calcSlippageBsp(slippage)

  const userLpBalance = balancesFor(lpToken?.address)

  const amountsOutPlaceholder = useMemo(
    () => poolTokenAddresses.map((_) => '0') ?? [],
    [poolTokenAddresses]
  )

  const exactInExitHandler = useMemo(() => {
    return balancerSdk
      ? new ExactInExitHandler(dexPoolId, poolTokens, tokens, balancerSdk)
      : null
  }, [balancerSdk, dexPoolId, poolTokens, tokens])

  const queryExactInExit = useCallback(
    async (params: QueryExactInExitParams) => {
      if (exactInExitHandler == null) return

      try {
        const result = await exactInExitHandler.queryExit(params)
        return result
      } catch (error) {
        throw error
      }
    },
    [exactInExitHandler]
  )

  const exactOutExitHandler = useMemo(() => {
    return balancerSdk
      ? new ExactOutExitHandler(dexPoolId, poolTokens, tokens, balancerSdk)
      : null
  }, [balancerSdk, dexPoolId, poolTokens, tokens])

  // const queryExactOutExit = useCallback(
  //   async (params: ExitParams) => {
  //     if (exactOutExitHandler == null) return

  //     try {
  //       return await exactOutExitHandler.queryExit(params)
  //     } catch (error) {
  //       throw error
  //     }
  //   },
  //   [exactOutExitHandler]
  // )

  // const calcPriceImpact = useCallback(
  //   async (params: ExitParams) => {
  //     const fn = params.assets.length > 1 ? queryExactInExit : queryExactOutExit

  //     try {
  //       const res = await fn(params)
  //       return res?.priceImpact ?? 0
  //     } catch (error) {
  //       throw error
  //     }
  //   },
  //   [queryExactInExit, queryExactOutExit]
  // )

  // const calcExitAmounts = useCallback(
  //   async (params: ExitParams) => {
  //     const fn = params.assets.length > 1 ? queryExactInExit : queryExactOutExit

  //     try {
  //       const res = await fn(params)
  //       return res?.amountsOut ?? amountsOutPlaceholder
  //     } catch (error) {
  //       throw error
  //     }
  //   },
  //   [amountsOutPlaceholder, queryExactInExit, queryExactOutExit]
  // )

  // const calc = useCallback(
  //   async (params: ExitParams) => {
  //     const fn = params.assets.length > 1 ? queryExactInExit : queryExactOutExit

  //     try {
  //       const res = await queryExactInExit(params)
  //       return {
  //         priceImpact: res?.priceImpact,
  //         amountsOut: res?.amountsOut ?? amountsOutPlaceholder,
  //       }
  //     } catch (error) {
  //       throw error
  //     }
  //   },
  //   [amountsOutPlaceholder, queryExactInExit, queryExactOutExit]
  // )

  // const exactExitOut = useCallback(
  //   async (params: ExitParams) => {
  //     if (!exactOutExitHandler) return

  //     try {
  //       const { exitRes } = await exactOutExitHandler.queryExit(params)
  //       const hash = await walletClient?.sendTransaction(exitRes)
  //       return hash
  //     } catch (error) {
  //       throw error
  //     }
  //   },
  //   [exactOutExitHandler, walletClient]
  // )

  // const exactExitIn = useCallback(
  //   async (params: ExitParams) => {
  //     if (!exactInExitHandler) return

  //     try {
  //       const { exitRes } = await exactInExitHandler!.queryExit(params)
  //       const hash = await walletClient?.sendTransaction(exitRes)
  //       return hash
  //     } catch (error) {
  //       throw error
  //     }
  //   },
  //   [exactInExitHandler, walletClient]
  // )

  return {
    queryExactInExit,
    // queryExactOutExit,
    // calcPriceImpact,
    // calcExitAmounts,
    // exactExitIn,
    // exactExitOut,
    // calc,
    // calcBptIn,
    // checkTokenOutAmountExceedsPoolBalance,
    // singleExitMaxAmounts,
  }
}
