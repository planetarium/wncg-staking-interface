import { STAKED_TOKEN_ADDRESS } from 'config/constants/addresses'
import { CHAINS } from 'config/chains'
import { assertUnreachable } from 'utils/assertUnreachable'
import { fetchBalancerPool } from './ethereum/fetchBalancerPool'
import { fetchPancakeSwapPool } from './bsc/fetchPancakeSwapPool'

export function prefetchPool(chainId: ChainId): Promise<LiquidityPool> {
  const { assetPlatform } = CHAINS[chainId]
  const lpTokenAddress = STAKED_TOKEN_ADDRESS[chainId]

  switch (assetPlatform) {
    case 'ethereum':
      return fetchBalancerPool(chainId)
    case 'binance-smart-chain':
      return fetchPancakeSwapPool(chainId, lpTokenAddress)
    default:
      assertUnreachable(chainId)
  }
}
