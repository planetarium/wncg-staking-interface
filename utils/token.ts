import { DEFAULT_TOKEN_INFO, TOKENS } from 'constants/tokens'
import { IS_ETHEREUM } from './env'

// TODO: Create a separate JSON file
const WNCG_ADDRESS = '0xf203ca1769ca8e9e8fe1da9d147db68b6c919817'
const WBTC_ADDRESS = '0x1c8e3bcb3378a443cc591f154c5ce0ebb4da9648'
const WETH_ADDRESS = IS_ETHEREUM
  ? '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
  : '0xdfcea9088c8a88a76ff74892c1457c17dfeef9c1'
const ETH_ADDRESS = '0x0000000000000000000000000000000000000000'

export const ethAddress = ETH_ADDRESS
export const wethAddress = WETH_ADDRESS
export const wncgAddress = IS_ETHEREUM ? WNCG_ADDRESS : WBTC_ADDRESS

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
