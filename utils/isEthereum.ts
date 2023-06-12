import { CHAINS } from 'config/chains'

export function isEthereum(chainId: ChainId) {
  return CHAINS[chainId].assetPlatform === 'ethereum'
}
