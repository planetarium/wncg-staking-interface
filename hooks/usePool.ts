import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { REFETCH_INTERVAL, STALE_TIME } from 'constants/time'
import { configService } from 'services/config'
import { fetchPool } from 'lib/graphql'
import { getTokenInfo, getTokenSymbol } from 'utils/token'
import { useStaking } from './contracts'

export function usePool() {
  const { stakedTokenAddress } = useStaking()
  const { data: pool, refetch } = useQuery(['pool'], fetchPool, {
    staleTime: STALE_TIME,
    refetchInterval: REFETCH_INTERVAL,
    keepPreviousData: true,
  })

  const poolId = configService.poolId

  const poolName = useMemo(
    () => pool?.name || 'Balancer Weighted Pool',
    [pool?.name]
  )

  const poolTokens = useMemo(() => pool?.tokens || [], [pool?.tokens])

  const poolTokenAddresses = useMemo(
    () => pool?.tokensList.map((address) => address.toLowerCase()) || [],
    [pool?.tokensList]
  )

  const poolTokenBalances = useMemo(
    () => poolTokens.map((token) => token.balance),
    [poolTokens]
  )

  const poolTokenDecimals = useMemo(
    () => poolTokens.map((token) => token.decimals),
    [poolTokens]
  )

  const poolTokenWeights = useMemo(
    () => poolTokens.map((token) => token.weight),
    [poolTokens]
  )

  const poolTokenSymbols = useMemo(
    () => poolTokenAddresses.map((address) => getTokenInfo(address).symbol),
    [poolTokenAddresses]
  )

  const poolTotalShares = useMemo(
    () => pool?.totalShares || '0',
    [pool?.totalShares]
  )

  const nativeAssetIndex = useMemo(() => {
    const match = poolTokenAddresses.findIndex(
      (address) => address.toLowerCase() === configService.weth
    )
    return Math.max(match, 0)
  }, [poolTokenAddresses])

  const ercTokenIndex = useMemo(() => {
    const match = poolTokenAddresses.findIndex(
      (address) => address.toLowerCase() !== configService.weth
    )
    return Math.max(match, 0)
  }, [poolTokenAddresses])

  const bptAddress = useMemo(
    () => pool?.address || stakedTokenAddress,
    [pool?.address, stakedTokenAddress]
  )

  const poolTokenName = useMemo(() => getTokenSymbol(bptAddress), [bptAddress])

  return {
    pool,
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
    ercTokenIndex,
    nativeAssetIndex,
    bptAddress,
    refetchPool: refetch,
  }
}
