import { useQuery } from '@tanstack/react-query'
import { useAtomValue, useSetAtom } from 'jotai'

import { currentTimestampAtom, isHarvestableAtom } from 'states/system'
import { queryKeys } from 'config/queryKeys'
import { fetchStaking } from 'lib/queries/fetchStaking'
import { useStaking } from 'hooks/useStaking'

export function useFetchStaking(options: UseFetchOptions = {}) {
  const {
    enabled: _enabled = true,
    refetchInterval,
    refetchOnWindowFocus = 'always',
    suspense = true,
  } = options
  const { balRewardPoolAddress, liquidityGaugeAddress } = useStaking()

  const currentTimestamp = useAtomValue(currentTimestampAtom)
  const setIsHarvestable = useSetAtom(isHarvestableAtom)

  const enabled = _enabled && !!liquidityGaugeAddress

  return useQuery(
    [queryKeys.Staking.Data, liquidityGaugeAddress],
    () => fetchStaking(liquidityGaugeAddress, balRewardPoolAddress),
    {
      enabled,
      staleTime: Infinity,
      refetchInterval,
      refetchOnWindowFocus,
      suspense,
      useErrorBoundary: false,
      onSuccess(data) {
        if (!data) return
        if (data.periodFinish > currentTimestamp) setIsHarvestable(false)
        else setIsHarvestable(true)
      },
    }
  )
}
