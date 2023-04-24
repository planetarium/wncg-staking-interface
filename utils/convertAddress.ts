import { TOKENS } from 'constants/tokens'

export function convertAddress(address: Hash) {
  const addressMap = TOKENS.PriceChainMap
  return (addressMap[address.toLowerCase() as Hash] ??
    address.toLowerCase()) as Hash
}
