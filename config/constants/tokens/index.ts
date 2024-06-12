import { ChainId } from 'config/chains'
import type { ChainMap } from 'config/types'

import ethereum from './1.json'
import sepolia from './11155111.json'
import bsc from './56.json'
import bscTestnet from './97.json'

type ExtendedTokenMap = {
  [address: Hash]: TokenInfo & {
    readonly chainId: ChainId
    readonly pricingAsset: Hash
  }
}

const ethereumTokens = ethereum.tokens as ExtendedTokenMap
const sepoliaTokens = sepolia.tokens as ExtendedTokenMap
const bscTokens = bsc.tokens as ExtendedTokenMap
const bscTestnetTokens = bscTestnet.tokens as ExtendedTokenMap

export const TOKENS: ChainMap<ExtendedTokenMap> = {
  [ChainId.ETHEREUM]: ethereumTokens,
  [ChainId.SEPOLIA]: sepoliaTokens,
  [ChainId.BSC]: bscTokens,
  [ChainId.BSC_TESTNET]: bscTestnetTokens,
}

export const PLACEHOLDER_TOKEN: TokenInfo = {
  address: '0x',
  name: '',
  symbol: '',
  decimals: 18,
}
