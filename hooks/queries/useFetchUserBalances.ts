import { useQuery } from '@tanstack/react-query'

import { queryKeys } from 'config/queryKeys'
import { fetchUserBalances } from 'lib/queries/fetchUserBalances'
import { useAuth, useStaking } from 'hooks'
import { formatUnits } from 'utils/formatUnits'

export function useFetchUserBalances(options: UseFetchOptions = {}) {
  const {
    enabled = true,
    refetchInterval,
    refetchOnWindowFocus = 'always',
  } = options

  const { account } = useAuth()
  const { stakedTokenAddress, poolTokenAddresses, tokenMap } = useStaking()

  const shouldFetch = enabled && !!account

  return useQuery<RawBalanceMap>(
    [queryKeys.User.Balances, account],
    () =>
      fetchUserBalances(account!, stakedTokenAddress, ...poolTokenAddresses),
    {
      enabled: shouldFetch,
      staleTime: Infinity,
      refetchInterval,
      refetchOnWindowFocus,
      select(data) {
        const entries = Object.entries(data).map(([addr, balance]) => {
          const { decimals } = tokenMap[addr as Hash]
          return [addr, formatUnits(balance ?? '0', decimals)]
        })
        return Object.fromEntries(entries)
      },
      suspense: false,
    }
  )
}
