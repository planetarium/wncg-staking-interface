import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { REFETCH_INTERVAL, STALE_TIME } from 'constants/time'
import PoolService from 'services/pool'
import { fetchPool } from 'lib/graphql'
import { getTokenInfo, getTokenSymbol } from 'utils/token'

export function usePool() {
  const { data: pool, refetch } = useQuery(['pool'], fetchPool, {
    staleTime: STALE_TIME,
    refetchInterval: REFETCH_INTERVAL,
    keepPreviousData: true,
  })

  const poolService = useMemo(() => {
    if (!pool) return null
    return new PoolService(pool)
  }, [pool])

  const poolId = poolService?.poolId || ''
  const poolName = poolService?.poolName || 'Balancer Weighted Pool'
  const poolTokens = poolService?.poolTokens || []
  const poolTokenAddresses = poolService?.poolTokenAddresses || []
  const poolTokenBalances = poolService?.poolTokenBalances || []
  const poolTokenDecimals = poolService?.poolTokenDecimals || []
  const poolTokenWeights = poolService?.poolTokenWeights || []
  const poolTokenSymbols = poolTokenAddresses.map(
    (address) => getTokenInfo(address).symbol
  )
  const poolTotalShares = poolService?.poolTotalShares || '0'
  const nativeAssetIndex =
    typeof poolService?.nativeAssetIndex === 'number'
      ? poolService?.nativeAssetIndex
      : 1

  const bptAddress = poolService?.bptAddress || ''
  const poolTokenName = getTokenSymbol(bptAddress)

  return {
    pool,
    poolService,
    poolId,
    poolName,
    poolTokens,
    poolTokenAddresses,
    poolTokenBalances,
    poolTokenDecimals,
    poolTokenName,
    poolTokenSymbols,
    poolTotalShares,
    poolTokenWeights,
    nativeAssetIndex,
    bptAddress,
    fetchPool: refetch,
  }
}
