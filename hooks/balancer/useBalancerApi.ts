import { BalancerApi, ChainId } from '@balancer/sdk'
import { useChain } from 'hooks'
import { useCallback } from 'react'

export function useBalancerApi() {
  const { chainId, dexPoolId } = useChain()

  const getPoolState = useCallback(async () => {
    if (!dexPoolId || !chainId) return
    const balancerApi = new BalancerApi(
      'https://api-v3.balancer.fi/',
      chainId as ChainId
    )
    return await balancerApi.pools.fetchPoolState(dexPoolId)
  }, [chainId, dexPoolId])

  return { getPoolState }
} 