import { IS_ETHEREUM } from './env'

// TODO: Create a separate JSON file
const WNCG_ADDRESS = '0xf203ca1769ca8e9e8fe1da9d147db68b6c919817'
const WBTC_ADDRESS = '0x1c8e3bcb3378a443cc591f154c5ce0ebb4da9648'
const WETH_ADDRESS = IS_ETHEREUM
  ? '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
  : '0xdfcea9088c8a88a76ff74892c1457c17dfeef9c1'

const tokenInfo: TokenInfo[] = [
  {
    address: WBTC_ADDRESS,
    name: 'Wrapped Bitcoin',
    decimals: 8,
    symbol: 'WBTC',
  },
  {
    address: WNCG_ADDRESS,
    name: 'Wrapped NCG',
    decimals: 18,
    symbol: 'WNCG',
  },
  {
    address: WETH_ADDRESS,
    name: 'Wrapped Ether',
    decimals: 18,
    symbol: 'WETH',
  },
]

export function getTokenInfo(address: string) {
  return tokenInfo.find(
    (t) => t.address.toLowerCase() === address.toLowerCase()
  )
}

export const wethAddress = WETH_ADDRESS
export const wncgAddress = IS_ETHEREUM ? WNCG_ADDRESS : WBTC_ADDRESS
