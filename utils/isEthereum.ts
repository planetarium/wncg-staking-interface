import { CHAINS } from 'config/chains'

export function isEthereum(chainId?: ChainId) {
  if (!chainId) return false
  return CHAINS[chainId].assetPlatform === 'ethereum'
}
