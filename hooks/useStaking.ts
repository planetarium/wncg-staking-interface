import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from 'config/constants/queryKeys'
import { useChain } from './useChain'
import { build } from 'lib/queries/build'

type UseStakingReturnEthereum = LiquidityPool &
  EthereumStaking & {
    tokens: TokenMap
    priceMap: PriceMap
  }

type UseStakingReturnBsc = LiquidityPool &
  Staking & {
    tokens: TokenMap
    priceMap: PriceMap
  }

export type UseStakingReturn<T extends 'ethereum' | undefined> =
  T extends undefined ? UseStakingReturnBsc : UseStakingReturnEthereum

type BuildResponse = {
  pool: LiquidityPool
  staking: Staking | EthereumStaking
  tokens: TokenMap
  priceMap: PriceMap
}

export function useStaking<T extends 'ethereum' | undefined>() {
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
