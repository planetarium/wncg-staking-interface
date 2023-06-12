import { ChainId } from 'config/chains'
import type { ChainMap } from 'config/types'

import ethereum from './1.json'
import goerli from './5.json'
import bsc from './56.json'
import bscTestnet from './97.json'

type ExtendedTokenMap = {
  [address: Hash]: TokenInfo & {
    readonly chainId: ChainId
    readonly pricingAsset: Hash
  }
}

const ethereumTokens = ethereum.tokens as ExtendedTokenMap
const goerliTokens = goerli.tokens as ExtendedTokenMap
const bscTokens = bsc.tokens as ExtendedTokenMap
const bscTestnetTokens = bscTestnet.tokens as ExtendedTokenMap

export const TOKENS: ChainMap<ExtendedTokenMap> = {
  [ChainId.ETHEREUM]: ethereumTokens,
  [ChainId.GOERLI]: goerliTokens,
  [ChainId.BSC]: bscTokens,
  [ChainId.BSC_TESTNET]: bscTestnetTokens,
}

export const PLACEHOLDER_TOKEN: TokenInfo = {
  address: '0x',
  name: '',
  symbol: '',
  decimals: 18,
}
