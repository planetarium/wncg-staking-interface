import { ChainId } from 'config/chains'
import { assertUnreachable } from 'utils/assertUnreachable'

export function getNetworkLabel(chainId: ChainId) {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return 'Ethereum'
    case ChainId.GOERLI:
      return 'Goerli'
    case ChainId.BSC:
      return 'BNB Smart Chain'
    case ChainId.BSC_TESTNET:
      return 'BSC Testnet'
    default:
      assertUnreachable(chainId)
  }
}
