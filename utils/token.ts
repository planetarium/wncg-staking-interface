import { DEFAULT_TOKEN_INFO, TOKENS } from 'constants/tokens'
import { ethereum, colors } from 'newStyles/constants/colors'

export function getTokenInfo(address?: string) {
  if (!address) return DEFAULT_TOKEN_INFO
  return TOKENS.TokenInfo[address.toLowerCase()] || DEFAULT_TOKEN_INFO
}

export function getTokenSymbol(address?: string) {
  return getTokenInfo(address).symbol
}

export function getTokenColor(address?: string) {
  const symbol = getTokenSymbol(address)

  switch (symbol.toLowerCase()) {
    case 'eth':
    case 'weth':
      return ethereum
    case 'wbtc':
    case 'wncg':
    case 'hotbody':
      return colors.green[600]
    case 'bal':
      return colors.gray[300]
    default:
      return '#fff'
  }
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
