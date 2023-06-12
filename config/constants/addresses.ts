import { ChainId } from '../chains'
import type { ChainMap } from '../types'

export const DEX_PROTOCOL_ADDRESS: ChainMap<Hash> = {
  [ChainId.ETHEREUM]: '0xba12222222228d8ba445958a75a0704d566bf2c8',
  [ChainId.GOERLI]: '0xba12222222228d8ba445958a75a0704d566bf2c8',
  [ChainId.BSC]: '0x10ed43c718714eb63d5aa57b78b54704e256024e',
  [ChainId.BSC_TESTNET]: '0xd99d1c33f9fc3444f8101754abc46c52416550d1',
}

export const STAKING_ADDRESS: ChainMap<Hash> = {
  [ChainId.ETHEREUM]: '0xc53b567a70db04e928fb96d6a417971aa88fda38',
  [ChainId.GOERLI]: '0x4faf546608e61269e7d361be45990daceb4a0ff1',
  [ChainId.BSC]: '0x69c2c2a0a26c223cd2f46774554a92c13ed5538f',
  [ChainId.BSC_TESTNET]: '0x846f38e0c7b3cc72a9545e4c249c5becb33df054',
}

export const WETH_ADDRESS: ChainMap<Hash> = {
  [ChainId.ETHEREUM]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  [ChainId.GOERLI]: '0xdfcea9088c8a88a76ff74892c1457c17dfeef9c1',
  [ChainId.BSC]: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
  [ChainId.BSC_TESTNET]: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
}

// FIXME: Get WNCG address
export const WNCG_ADDRESS: ChainMap<Hash> = {
  [ChainId.ETHEREUM]: '0xf203ca1769ca8e9e8fe1da9d147db68b6c919817',
  [ChainId.GOERLI]: '0xa488533be3018a0720c4c0647f407f3b41e6cb82',
  [ChainId.BSC]: '0x',
  [ChainId.BSC_TESTNET]: '0x',
}

export const BAL_ADDRESS: ChainMap<Hash | null> = {
  [ChainId.ETHEREUM]: '0xba100000625a3754423978a60c9317c58a424e3d',
  [ChainId.GOERLI]: '0xfa8449189744799ad2ace7e0ebac8bb7575eff47',
  [ChainId.BSC]: null,
  [ChainId.BSC_TESTNET]: null,
}

export const NATIVE_CURRENCY_ADDRESS: Hash =
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

export const MULTICALL_3_ADDRESS: Hash =
  '0xca11bde05977b3631167028862be2a173976ca11'

export const ZERO_ADDRESS: Hash = '0x0000000000000000000000000000000000000000'
