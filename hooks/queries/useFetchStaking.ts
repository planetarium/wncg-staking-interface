import { useQuery } from '@tanstack/react-query'
import { useAtomValue, useSetAtom } from 'jotai'

import { currentTimestampAtom, isHarvestableAtom } from 'states/system'
import { QUERY_KEYS } from 'config/constants/queryKeys'
import { fetchStaking } from 'lib/queries/fetchStaking'
import { useChain } from 'hooks/useChain'
import { useStaking } from 'hooks/useStaking'

export function useFetchStaking(options: UseFetchOptions = {}) {
  const {
    enabled = true,
    refetchInterval,
    refetchOnWindowFocus,
    suspense,
  } = options

  const { chainId, stakingAddress } = useChain()
  const props = useStaking<'ethereum'>()

  const currentTimestamp = useAtomValue(currentTimestampAtom)
  const setIsHarvestable = useSetAtom(isHarvestableAtom)

  return useQuery(
    [QUERY_KEYS.Staking.Data, stakingAddress, chainId],
    () => fetchStaking(chainId),
    {
      enabled,
      staleTime: Infinity,
      refetchInterval,
      refetchOnWindowFocus,
      suspense: false,
      useErrorBoundary: false,
      placeholderData: props,
      onSuccess(data) {
        // if (!data) return
        // if (data.periodFinish > currentTimestamp) setIsHarvestable(false)
        // else setIsHarvestable(true)
      },
    }
  )
}
