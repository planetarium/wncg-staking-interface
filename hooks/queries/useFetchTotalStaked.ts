import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from 'config/constants/queryKeys'
import { fetchTotalStaked } from 'lib/queries/fetchTotalStaked'
import { useChain } from 'hooks'

export function useFetchTotalStaked(options: UseFetchOptions = {}) {
  const {
    enabled = true,
    refetchInterval,
    refetchOnWindowFocus,
    suspense = true,
  } = options

  const { chainId, stakingAddress } = useChain()

  return useQuery<string>(
    [QUERY_KEYS.Staking.TotalStaked, stakingAddress, chainId],
    () => fetchTotalStaked(chainId),
    {
      enabled,
      refetchInterval,
      refetchOnWindowFocus,
      suspense,
    }
  )
}
