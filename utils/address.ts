import { TOKENS } from 'constants/tokens'

export function convertAddress(address: string) {
  const addressMap = TOKENS.PriceChainMap
  return addressMap[address.toLowerCase()] || address
}

export function uniqAddress(_addresses: string[]) {
  const addresses = _addresses.map((address) => address.toLowerCase())
  return addresses.flatMap((address, i) => {
    if (!address) return []
    if (addresses.indexOf(address) !== i) return []
    return address
  })
}
