import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { QUERY_KEYS } from 'config/constants/queryKeys'
import { build } from 'lib/queries/build'
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

  const initialData = useQueryClient().getQueryData<any>([
    QUERY_KEYS.Build,
    chainId,
  ])

  const { data } = useQuery(
    [QUERY_KEYS.Build, chainId],
    () => build(chainId!),
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      enabled: !!chainId,
      initialData,
    }
  )

  return {
    ...data?.pool,
    ...data?.staking,
    tokens: data?.tokens,
    priceMap: data?.priceMap,
  } as UseStakingReturn<T>
}
