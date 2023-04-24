import { useQuery } from '@tanstack/react-query'

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
  const { liquidityGaugeAddress } = useStaking()

  const enabled = _enabled && !!liquidityGaugeAddress

  return useQuery(
    [queryKeys.Staking.Data, liquidityGaugeAddress],
    () => fetchStaking(liquidityGaugeAddress),
    {
      enabled,
      staleTime: Infinity,
      refetchInterval,
      refetchOnWindowFocus,
      suspense,
      useErrorBoundary: false,
    }
  )
}
