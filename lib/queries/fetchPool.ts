import { CHAINS } from 'config/chains'
import { assertUnreachable } from 'utils/assertUnreachable'
import { fetchBalancerPool } from './ethereum/fetchBalancerPool'
import { fetchPancakeSwapPool } from './bsc/fetchPancakeSwapPool'

export function fetchPool(chainId: ChainId, lpTokenAddress: Hash) {
  const { assetPlatform } = CHAINS[chainId]

  switch (assetPlatform) {
    case 'ethereum':
      return fetchBalancerPool(chainId)
    case 'binance-smart-chain':
      return fetchPancakeSwapPool(chainId, lpTokenAddress)
    default:
      assertUnreachable(chainId)
  }
}
