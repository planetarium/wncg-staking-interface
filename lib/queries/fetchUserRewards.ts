import { CHAINS } from 'config/chains'
import { fetchEthereumUserRewards } from './ethereum/fetchEthereumUserRewards'
import { fetchBscUserRewards } from './bsc/fetchBscUserRewards'
import { assertUnreachable } from 'utils/assertUnreachable'

export async function fetchUserRewards(chainId: ChainId, account: Hash) {
  const { assetPlatform } = CHAINS[chainId]

  switch (assetPlatform) {
    case 'ethereum':
      return fetchEthereumUserRewards(chainId, account)
    case 'binance-smart-chain':
      return fetchBscUserRewards(chainId, account)
    default:
      assertUnreachable(chainId)
  }
}
