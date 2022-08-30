import { DEFAULT_TOKEN_INFO, TOKENS } from 'constants/tokens'

export function getTokenInfo(address?: string) {
  if (!address) return DEFAULT_TOKEN_INFO
  return TOKENS.TokenInfo[address.toLowerCase()] || DEFAULT_TOKEN_INFO
}

export function getTokenSymbol(address?: string) {
  return getTokenInfo(address).symbol
}

export function findTokenAddressBySymbol(symbol = '') {
  const match = Object.values(TOKENS.TokenInfo).find(
    (tokenInfo) => tokenInfo.symbol.toLowerCase() === symbol.toLowerCase()
  )
  return match ? match.address : ''
}

export function getTokenIndex(list: string[], value: string) {
  return list.findIndex((symbol) => value.includes(symbol))
}
