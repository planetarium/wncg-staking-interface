import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from 'config/constants/queryKeys'
import { fetchUserBalances } from 'lib/queries/fetchUserBalances'
import { useAuth, useChain, useStaking } from 'hooks'

export function useFetchUserBalances(options: UseFetchOptions = {}) {
  const {
    enabled: _enabled = true,
    refetchInterval,
    refetchOnWindowFocus,
    suspense = true,
  } = options

  const { account, isConnected } = useAuth()
  const { chainId } = useChain()
  const { lpToken, poolTokenAddresses } = useStaking()

  const enabled = _enabled && !!isConnected

  const list = useMemo(
    () => [lpToken?.address, ...poolTokenAddresses],
    [lpToken?.address, poolTokenAddresses]
  )

  return useQuery<RawBalanceMap>(
    [QUERY_KEYS.User.Balances, account, chainId, ...list],
    () => fetchUserBalances(chainId, account!, list),
    {
      enabled,
      staleTime: Infinity,
      refetchInterval,
      refetchOnWindowFocus,
      suspense,
    }
  )
}
