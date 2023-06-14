import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from 'config/constants/queryKeys'
import { useChain } from './useChain'
import { build } from 'lib/queries/build'

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

  const { data } = useQuery([QUERY_KEYS.Build, chainId], () => build(chainId), {
    staleTime: Infinity,
    cacheTime: Infinity,
  })

  return {
    ...data?.pool,
    ...data?.staking,
    tokens: data?.tokens,
    priceMap: data?.priceMap,
  } as UseStakingReturn<T>
}
