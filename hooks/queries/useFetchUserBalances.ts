import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from 'config/constants/queryKeys'
import { fetchUserBalances } from 'lib/queries/fetchUserBalances'
import { useAuth, useChain, useStaking } from 'hooks'

export function useFetchUserBalances(options: UseFetchOptions = {}) {
  const { enabled = true, refetchInterval, refetchOnWindowFocus } = options

  const { account } = useAuth()
  const { chainId } = useChain()
  const { lpToken, poolTokenAddresses } = useStaking()

  const shouldFetch = enabled && !!account

  const list = [lpToken.address, ...poolTokenAddresses]

  return useQuery<RawBalanceMap>(
    [QUERY_KEYS.User.Balances, account, chainId, ...list],
    () => fetchUserBalances(chainId, account!, list),
    {
      enabled: shouldFetch,
      staleTime: Infinity,
      refetchInterval,
      refetchOnWindowFocus,
      suspense: true,
    }
  )
}
