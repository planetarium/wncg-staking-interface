import { useSetAtom } from 'jotai'
import { useQuery } from '@tanstack/react-query'

import { unstakeTimestampsAtom } from 'states/account'
import { QUERY_KEYS } from 'config/constants/queryKeys'
import { fetchUserData } from 'lib/queries/fetchUserData'
import { useAuth, useChain } from 'hooks'

export function useFetchUserData(options: UseFetchOptions = {}) {
  const {
    enabled: _enabled = true,
    refetchInterval,
    refetchOnWindowFocus,
    suspense,
  } = options

  const { account, isConnected } = useAuth()
  const { chainId } = useChain()

  const setUnstakeTimestamps = useSetAtom(unstakeTimestampsAtom)

  const enabled = _enabled && !!account && !!isConnected

  return useQuery(
    [QUERY_KEYS.User.Data, account!, chainId],
    () => fetchUserData(chainId, account!),
    {
      enabled,
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchInterval,
      refetchOnWindowFocus,
      suspense,
      useErrorBoundary: false,
      onSuccess(data) {
        const { stakedTokenBalance, ...rest } = data
        console.log('💜')
        setUnstakeTimestamps(rest)
      },
    }
  )
}
