import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from 'config/constants/queryKeys'
import { fetchUserRewards } from 'lib/queries/fetchUserRewards'
import { useAuth, useChain } from 'hooks'

export function useFetchUserRewards(options: UseFetchOptions = {}) {
  const { enabled: _enabled = true, refetchInterval, suspense = true } = options

  const { account, isConnected } = useAuth()
  const { chainId } = useChain()

  const enabled = _enabled && !!account && !!isConnected

  return useQuery(
    [QUERY_KEYS.User.Rewards, account!, chainId],
    () => fetchUserRewards(chainId, account!),
    {
      enabled,
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchInterval,
      refetchOnWindowFocus: 'always',
      suspense,
      useErrorBoundary: false,
      onSuccess() {
        console.log('🖤 REWARDS')
      },
    }
  )
}
