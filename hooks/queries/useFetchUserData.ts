import { useSetAtom } from 'jotai'
import { useQuery } from '@tanstack/react-query'

import { unstakeTimestampsAtom } from 'states/account'
import { queryKeys } from 'config/queryKeys'
import { fetchUserData } from 'lib/queries/fetchUserData'
import { useAuth } from 'hooks'

export function useFetchUserData(options: UseFetchOptions = {}) {
  const { enabled: _enabled = true, refetchInterval, suspense = true } = options

  const { account, isConnected } = useAuth()

  const setUnstakeTimestamps = useSetAtom(unstakeTimestampsAtom)

  const enabled = _enabled && !!account && !!isConnected

  return useQuery<UserDataResponse>(
    [queryKeys.User.Data, account!],
    () => fetchUserData(account!),
    {
      enabled,
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchInterval,
      refetchOnWindowFocus: 'always',
      suspense,
      useErrorBoundary: false,
      onSuccess(data) {
        if (!data) return

        const { cooldownEndsAt, withdrawEndsAt, cooldowns } = data

        setUnstakeTimestamps({
          cooldownEndsAt,
          withdrawEndsAt,
          cooldowns,
        })
      },
    }
  )
}
