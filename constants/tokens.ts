import { Network } from '@balancer-labs/sdk'

import { configService } from 'services/config'

export const NATIVE_ASSET_ADDRESS = configService.nativeAssetAddress
export const DEFAULT_TOKEN_DECIMALS = 18

export const MAINNET_NETWORK_CONFIG = configService.getNetworkConfig(
  Network.MAINNET
)
export const GOERLI_NETWORK_CONFIG = configService.getNetworkConfig(
  Network.MAINNET
)
export const KOVAN_NETWORK_CONFIG = configService.getNetworkConfig(
  Network.MAINNET
)

export const DEFAULT_TOKEN_INFO: TokenInfo = {
  address: '',
  name: '',
  decimals: DEFAULT_TOKEN_DECIMALS,
  symbol: '',
}

export const TOKENS_MAINNET: TokenConstants = {
  Addresses: {
    nativeAsset: MAINNET_NETWORK_CONFIG.nativeAsset.address,
    WETH: MAINNET_NETWORK_CONFIG.addresses.weth,
    BAL: MAINNET_NETWORK_CONFIG.addresses.bal,
  },
  PriceChainMap: {
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2':
      '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
    '0xba100000625a3754423978a60c9317c58a424e3d':
      '0xba100000625a3754423978a60c9317c58a424e3d', // BAL
    '0xf203ca1769ca8e9e8fe1da9d147db68b6c919817':
      '0xf203ca1769ca8e9e8fe1da9d147db68b6c919817', // WNCG
    '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599':
      '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', // WBTC
  },
  TokenInfo: {
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': {
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      name: 'Ether',
      decimals: 18,
      symbol: 'ETH',
    },
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': {
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      name: 'Wrapped Ether',
      decimals: 18,
      symbol: 'WETH',
    },
    '0xba100000625a3754423978a60c9317c58a424e3d': {
      address: '0xba100000625a3754423978a60c9317c58a424e3d',
      name: 'Balancer',
      decimals: 18,
      symbol: 'BAL',
    },
    '0xf203ca1769ca8e9e8fe1da9d147db68b6c919817': {
      address: '0xf203ca1769ca8e9e8fe1da9d147db68b6c919817',
      name: 'Wrapped NCG',
      decimals: 18,
      symbol: 'WNCG',
    },
    '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': {
      address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      name: 'Wrapped Bitcoin',
      decimals: 8,
      symbol: 'WBTC',
    },
    '0xe8cc7e765647625b95f59c15848379d10b9ab4af': {
      address: '0xe8cc7e765647625b95f59c15848379d10b9ab4af',
      name: 'Balancer 20 WETH 80 WNCG',
      decimals: 18,
      symbol: '20WETH-80WNCG',
    },
  },
}

export const TOKENS_GOERLI: TokenConstants = {
  Addresses: {
    nativeAsset: GOERLI_NETWORK_CONFIG.nativeAsset.address,
    WETH: GOERLI_NETWORK_CONFIG.addresses.weth,
    BAL: GOERLI_NETWORK_CONFIG.addresses.bal,
  },
  PriceChainMap: {
    /**
     * Addresses must be lower case and map from goerli to mainnet, e.g
     * [goerli address]: mainnet address
     */
    '0xdfcea9088c8a88a76ff74892c1457c17dfeef9c1':
      '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
    '0xfa8449189744799ad2ace7e0ebac8bb7575eff47':
      '0xba100000625a3754423978a60c9317c58a424e3d', // BAL
    '0xa488533be3018a0720c4c0647f407f3b41e6cb82':
      '0xf203ca1769ca8e9e8fe1da9d147db68b6c919817', // WNCG (HOTBODY)
    '0x37f03a12241e9fd3658ad6777d289c3fb8512bc9':
      '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', // WBTC
  },
  TokenInfo: {
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': {
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      name: 'Ether',
      decimals: 18,
      symbol: 'ETH',
    },
    '0xdfcea9088c8a88a76ff74892c1457c17dfeef9c1': {
      address: '0xdfcea9088c8a88a76ff74892c1457c17dfeef9c1',
      name: 'Wrapped Ether',
      decimals: 18,
      symbol: 'WETH',
    },
    '0xfa8449189744799ad2ace7e0ebac8bb7575eff47': {
      address: '0xfa8449189744799ad2ace7e0ebac8bb7575eff47',
      name: 'Balancer',
      decimals: 18,
      symbol: 'BAL',
    },
    '0xa488533be3018a0720c4c0647f407f3b41e6cb82': {
      address: '0xa488533be3018a0720c4c0647f407f3b41e6cb82',
      name: 'Hotbody',
      decimals: 18,
      symbol: 'HOTBODY',
    },
    '0x37f03a12241e9fd3658ad6777d289c3fb8512bc9': {
      address: '0x37f03a12241e9fd3658ad6777d289c3fb8512bc9',
      name: 'Wrapped Bitcoin',
      decimals: 8,
      symbol: 'WBTC',
    },
    '0x16faf9f73748013155b7bc116a3008b57332d1e6': {
      address: '0x16faf9f73748013155b7bc116a3008b57332d1e6',
      name: 'Balancer 50 WBTC 50 WETH',
      decimals: 18,
      symbol: 'B-50WBTC-50WETH',
    },
  },
}

export const TOKENS_KOVAN: TokenConstants = {
  Addresses: {
    nativeAsset: KOVAN_NETWORK_CONFIG.nativeAsset.address,
    WETH: KOVAN_NETWORK_CONFIG.addresses.weth,
    BAL: KOVAN_NETWORK_CONFIG.addresses.bal,
  },
  PriceChainMap: {
    /**
     * Addresses must be lower case and map from kovan to mainnet, e.g
     * [kovan address]: mainnet address
     */
    '0xdfcea9088c8a88a76ff74892c1457c17dfeef9c1':
      '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
    // BAL
    '0xcb355677e36f390ccc4a5d4beadfbf1eb2071c81':
      '0xba100000625a3754423978a60c9317c58a424e3d', // BAL
    '0xa488533be3018a0720c4c0647f407f3b41e6cb82':
      '0xf203ca1769ca8e9e8fe1da9d147db68b6c919817', // WNCG (HOTBODY)
    '0x1c8e3bcb3378a443cc591f154c5ce0ebb4da9648':
      '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', // WBTC
  },
  TokenInfo: {
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': {
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      name: 'Ether',
      decimals: 18,
      symbol: 'ETH',
    },
    '0xdfcea9088c8a88a76ff74892c1457c17dfeef9c1': {
      address: '0xdfcea9088c8a88a76ff74892c1457c17dfeef9c1',
      name: 'Wrapped Ether',
      decimals: 18,
      symbol: 'WETH',
    },
    '0xcb355677e36f390ccc4a5d4beadfbf1eb2071c81': {
      address: '0xcb355677e36f390ccc4a5d4beadfbf1eb2071c81',
      name: 'Balancer',
      decimals: 18,
      symbol: 'BAL',
    },
    '0xa488533be3018a0720c4c0647f407f3b41e6cb82': {
      address: '0xa488533be3018a0720c4c0647f407f3b41e6cb82',
      name: 'Hotbody',
      decimals: 18,
      symbol: 'HOTBODY',
    },
    '0x1c8e3bcb3378a443cc591f154c5ce0ebb4da9648': {
      address: '0x1c8e3bcb3378a443cc591f154c5ce0ebb4da9648',
      name: 'Wrapped Bitcoin',
      decimals: 8,
      symbol: 'WBTC',
    },
    '0x647c1fd457b95b75d0972ff08fe01d7d7bda05df': {
      address: '0x647c1fd457b95b75d0972ff08fe01d7d7bda05df',
      name: 'Balancer 50 WBTC 50 WETH',
      decimals: 18,
      symbol: 'B-50WBTC-50WETH',
    },
  },
}

const TOKENS_MAP: Partial<Record<Network, TokenConstants>> = {
  [Network.GOERLI]: TOKENS_GOERLI,
  [Network.KOVAN]: TOKENS_KOVAN,
  [Network.MAINNET]: TOKENS_MAINNET,
}

const TOKENS_PLACEHOLDER: TokenConstants = {
  Addresses: {
    nativeAsset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    WETH: '0x0000000000000000000000000000000000000000',
    BAL: '0x0000000000000000000000000000000000000000',
  },
  PriceChainMap: {},
  TokenInfo: {},
}

export const TOKENS: TokenConstants =
  TOKENS_MAP[configService.networkId] || TOKENS_PLACEHOLDER

export const TOKEN_PRICES_PLACEHOLDERS = Object.fromEntries(
  Object.keys(TOKENS.PriceChainMap || {}).map((key) => [key, '0'])
)
