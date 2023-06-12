import { CHAINS } from 'config/chains'
import { assertUnreachable } from 'utils/assertUnreachable'
import { fetchBscStaking } from './bsc/fetchBscStaking'
import { fetchEthereumStaking } from './ethereum/fetchEthereumStaking'

export async function prefetchStaking(
  chainId: ChainId
): Promise<Staking | EthereumStaking> {
  const { assetPlatform } = CHAINS[chainId]

  switch (assetPlatform) {
    case 'ethereum':
      return fetchEthereumStaking(chainId)
    case 'binance-smart-chain':
      return fetchBscStaking(chainId)
    default:
      assertUnreachable(chainId)
  }
}
