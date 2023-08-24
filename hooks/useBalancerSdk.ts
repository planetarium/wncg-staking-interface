import { useCallback, useEffect, useMemo, useState } from 'react'
import { BalancerSDK, Network, PoolWithMethods } from '@balancer-labs/sdk'

import { isEthereum } from 'utils/isEthereum'
import { useChain } from './useChain'

export function useBalancerSdk() {
  const { chainId, dexPoolId, subgraph, rpcUrl } = useChain()
  const [sdkPool, setSdkPool] = useState<PoolWithMethods | null>(null)

  const balancer = useMemo(() => {
    if (!isEthereum(chainId)) return null
    return new BalancerSDK({
      network: chainId as Network,
      rpcUrl,
      customSubgraphUrl: subgraph,
    })
  }, [chainId, rpcUrl, subgraph])

  const getSdkPool = useCallback(async () => {
    if (!balancer) return null

    const pool = await balancer.pools.find(dexPoolId)
    if (pool) setSdkPool(pool)
  }, [balancer, dexPoolId])

  useEffect(() => {
    getSdkPool()
  }, [getSdkPool])

  return sdkPool
}
