import { useSetAtom } from 'jotai'
import { useQuery } from '@tanstack/react-query'

import { unstakeTimestampsAtom } from 'states/account'
import { isHarvestableAtom } from 'states/system'
import { queryKeys } from 'config/queryKeys'
import { fetchUserData } from 'lib/queries/fetchUserData'
import { bnum } from 'utils/bnum'
import { useAuth } from 'hooks'

export function useFetchUserData(options: UseFetchOptions = {}) {
  const { enabled: _enabled = true, refetchInterval, suspense = true } = options

  const { account, isConnected } = useAuth()

  const setUnstakeTimestamps = useSetAtom(unstakeTimestampsAtom)
  const setIsHarvestable = useSetAtom(isHarvestableAtom)

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

        if (
          bnum(data.stakedTokenBalance).gt(0) &&
          bnum(data.earnedRewards[1]).isZero()
        ) {
          setIsHarvestable(true)
        } else {
          setIsHarvestable(false)
        }

        setUnstakeTimestamps({
          cooldownEndsAt,
          withdrawEndsAt,
          cooldowns,
        })
      },
    }
  )
}
