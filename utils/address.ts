import { TOKENS } from 'constants/tokens'

export function convertAddress(address: string) {
  const addressMap = TOKENS.PriceChainMap
  return addressMap[address.toLowerCase()] || address
}

export function uniqAddress(addresses: string[]) {
  return addresses.flatMap((address, i) => {
    if (!address) return []
    if (addresses.indexOf(address) !== i) return []
    return address
  })
}
