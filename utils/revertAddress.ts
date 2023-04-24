import { TOKENS } from 'constants/tokens'

export function revertAddress(address: Hash) {
  const addressMap = TOKENS.PriceChainMap
  const matchKey = Object.entries(addressMap).find(([, value]) => {
    return value.toLowerCase() === address.toLowerCase()
  })
  return (matchKey ? matchKey[0] : address) as Hash
}
