import { TOKENS } from 'constants/tokens'

export function revertAddress(address: string) {
  const addressMap = TOKENS.PriceChainMap
  const matchKey = Object.entries(addressMap).find(([, value]) => {
    return value.toLowerCase() === address.toLowerCase()
  })
  return matchKey ? matchKey[0] : ''
}

export function convertAddress(address: string) {
  const addressMap = TOKENS.PriceChainMap
  return addressMap[address.toLowerCase()] || address.toLowerCase()
}

export function uniqAddress(addresses: Array<string | undefined>) {
  return [
    ...new Set(addresses.filter((v) => typeof v === 'string') as string[]),
  ]
}
