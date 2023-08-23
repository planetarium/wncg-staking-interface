import type { ChainMap } from 'config/types'

import _ethereum from './1.json'
import _goerli from './5.json'
import _bsc from './56.json'
import _bscTestnet from './97.json'

export const ChainId = {
  ETHEREUM: 1,
  GOERLI: 5,
  BSC: 56,
  BSC_TESTNET: 97,
} as const

export type ChainId = (typeof ChainId)[keyof typeof ChainId]

const bsc = _bsc as ChainConfig
const bscTestnet = _bscTestnet as ChainConfig
const ethereum = _ethereum as ChainConfig
const goerli = _goerli as ChainConfig

export const CHAINS: ChainMap<ChainConfig> = {
  [ChainId.ETHEREUM]: ethereum,
  [ChainId.GOERLI]: goerli,
  [ChainId.BSC]: bsc,
  [ChainId.BSC_TESTNET]: bscTestnet,
}

// NOTE: Change default chainId depending on environment
export const defaultChainId = ChainId.GOERLI

export const isTestnet =
  defaultChainId === ChainId.GOERLI || defaultChainId === ChainId.BSC_TESTNET

export const SUPPORTED_CHAINS: ChainId[] = isTestnet
  ? [ChainId.GOERLI, ChainId.BSC_TESTNET]
  : [ChainId.ETHEREUM, ChainId.BSC]
