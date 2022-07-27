import { assertUnreachable } from './assertion'

export function getSymbolFromAddress(address: string) {
  switch (address.toLowerCase()) {
    case '0xf203ca1769ca8e9e8fe1da9d147db68b6c919817': // Mainnet (WNCG)
    case '0x1c8e3bcb3378a443cc591f154c5ce0ebb4da9648': // Kovan (WBTC)
      return 'wncg'
    case '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': // Mainnet (WETH)
    case '0xdfcea9088c8a88a76ff74892c1457c17dfeef9c1': // Kovan (WETH)
      return 'weth'
    default:
      assertUnreachable(address)
  }
}
