import { CHAINS } from 'config/chains'

export function isBsc(chainId?: ChainId) {
  if (!chainId) return false
  return CHAINS[chainId].assetPlatform === 'binance-smart-chain'
}
