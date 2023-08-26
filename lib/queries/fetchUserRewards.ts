import { CHAINS } from 'config/chains'
import { fetchBscUserRewards } from 'lib/queries/bsc/fetchBscUserRewards'
import { fetchEthereumUserRewards } from 'lib/queries/ethereum/fetchEthereumUserRewards'
import { assertUnreachable } from 'utils/assertUnreachable'

export async function fetchUserRewards(
  chainId: ChainId,
  account?: Hash | null
) {
  const { assetPlatform } = CHAINS[chainId]
  account = account ?? undefined

  switch (assetPlatform) {
    case 'ethereum':
      return fetchEthereumUserRewards(chainId, account)
    case 'binance-smart-chain':
      return fetchBscUserRewards(chainId, account)
    default:
      assertUnreachable(chainId)
  }
}
