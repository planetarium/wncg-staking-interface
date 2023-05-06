import { DEFAULT_TOKEN_INFO, TOKENS } from 'constants/tokens'

export function getTokenInfo(address?: string) {
  if (!address) return DEFAULT_TOKEN_INFO
  return TOKENS.TokenInfo[address.toLowerCase() as Hash] || DEFAULT_TOKEN_INFO
}

export function getTokenSymbol(address?: string) {
  return getTokenInfo(address).symbol
}
