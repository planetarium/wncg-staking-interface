import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { QUERY_KEYS } from 'config/constants/queryKeys'
import { build } from 'lib/queries/build'
import { useChain } from './useChain'
import { fetchStaking } from 'lib/queries/fetchStaking'
import { fetchProject } from 'lib/queries/fetchProject'
import { priceAtom, projectAtom } from 'pages/wncg/[chainId]'
import { TOKENS } from 'config/constants/tokens'

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

  // const initialData = useQueryClient().getQueryData<any>([
  //   QUERY_KEYS.Build,
  //   chainId,
  // ])

  // console.log(333, initialData)

  // const { data } = useQuery(
  //   [QUERY_KEYS.Build, chainId],
  //   () => fetchProject(chainId!),
  //   {
  //     staleTime: Infinity,
  //     cacheTime: Infinity,
  //     enabled: !!chainId,
  //     initialData,
  //   }
  // )

  // const poolTokenAddresses = data.poolTokens.map((t) => t.address)

  const project = useAtomValue(projectAtom)
  const prices = useAtomValue(priceAtom)

  const poolTokenAddresses = project.poolTokens.map((t: any) => t.address)
  const poolTokenWeights = project.poolTokens.map((t: any) => t.weight)
  const poolTokenDecimals = project.poolTokens.map((t: any) => t.decimals)
  const poolTokenSymbols = project.poolTokens.map((t: any) => t.symbol)
  const poolTokenNames = project.poolTokens.map((t: any) => t.name)
  const poolTokenBalances = project.poolTokens.map((t: any) => t.balance)

  return {
    ...project,
    priceMap: prices,
    poolTokenAddresses,
    poolTokenWeights,
    poolTokenDecimals,
    poolTokenSymbols,
    poolTokenNames,
    poolTokenBalances,
    tokens: TOKENS[chainId],
  } as UseStakingReturn<T>
}
