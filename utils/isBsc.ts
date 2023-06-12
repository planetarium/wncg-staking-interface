import { CHAINS } from 'config/chains'

export function isBsc(chainId: ChainId) {
  return CHAINS[chainId].assetPlatform === 'binance-smart-chain'
}
