import { TOKENS } from 'config/constants/tokens'

// Pricing assets are used for testnet only.
export function getPricingAsset(chainId: ChainId, address: Hash) {
  return TOKENS[chainId]?.[address]?.pricingAsset ?? address
}
