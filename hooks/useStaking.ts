import { useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from 'config/constants/queryKeys'
import { bnum } from 'utils/bnum'
import { useChain } from './useChain'

type UseStakingReturnBsc = LiquidityPool &
  BscStaking & {
    tokens: TokenMap
    priceMap: PriceMap
  }

type UseStakingReturnEthereum = LiquidityPool &
  EthereumStaking & {
    tokens: TokenMap
    priceMap: PriceMap
  }

type UseStakingReturn<T extends 'ethereum'> = T extends 'ethereum'
  ? UseStakingReturnEthereum
  : UseStakingReturnBsc

export function useStaking<T extends 'ethereum'>() {
  const { chainId } = useChain()
  const queryClient = useQueryClient()

  const project = useMemo(
    () => queryClient.getQueryData<any>([QUERY_KEYS.Build, chainId]),
    [chainId, queryClient]
  )

  const prices = useMemo(
    () =>
      queryClient.getQueryData<PriceMap>([QUERY_KEYS.Staking.Prices, chainId], {
        exact: false,
      }),
    [chainId, queryClient]
  )

  const poolTokenAddresses = project.poolTokens?.map((t: any) => t.address)
  const poolTokenWeights = project.poolTokens.map((t: any) => t.weight)
  const poolTokenWeightsInPcnt = poolTokenWeights.map((w: string) =>
    bnum(w).times(100).toNumber()
  )
  const poolTokenDecimals = project.poolTokens.map((t: any) => t.decimals)
  const poolTokenSymbols = project.poolTokens.map((t: any) => t.symbol)
  const poolTokenNames = project.poolTokens.map((t: any) => t.name)
  const poolTokenBalances = project.poolTokens.map((t: any) => t.balance)

  return {
    ...project,
    priceMap: prices,
    poolTokenAddresses,
    poolTokenWeights,
    poolTokenWeightsInPcnt,
    poolTokenDecimals,
    poolTokenSymbols,
    poolTokenNames,
    poolTokenBalances,
  } as UseStakingReturn<T>
}
