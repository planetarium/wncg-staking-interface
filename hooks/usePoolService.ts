import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import PoolService from 'services/pool'
import { fetchPool } from 'lib/graphql'
import { getTokenInfo } from 'utils/token'
import { useAllowances } from 'hooks'

export function usePoolService() {
  const { data: pool, refetch } = useQuery(['pool'], fetchPool, {
    keepPreviousData: true,
    staleTime: 5 * 1_000,
  })

  const poolService = useMemo(() => {
    if (!pool) return null
    return new PoolService(pool)
  }, [pool])

  const poolTokens = poolService?.poolTokens || []
  const poolTokenAddresses = poolService?.poolTokenAddresses || []
  const poolTokenDecimals = poolService?.poolTokenDecimals || []
  const poolTokenSymbols = poolTokenAddresses.map(
    (address) => getTokenInfo(address).symbol
  )
  const nativeAssetIndex = poolService?.nativeAssetIndex || 1

  const bptAddress = poolService?.bptAddress || ''

  return {
    pool,
    poolService,
    poolTokens,
    poolTokenAddresses,
    poolTokenDecimals,
    poolTokenSymbols,
    nativeAssetIndex,
    bptAddress,
    fetchPool: refetch,
  }
}
