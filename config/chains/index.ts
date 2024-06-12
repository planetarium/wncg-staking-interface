import type { ChainMap } from 'config/types'

import _ethereum from './1.json'
import _sepolia from './11155111.json'
import _bsc from './56.json'
import _bscTestnet from './97.json'

export const ChainId = {
  ETHEREUM: 1,
  SEPOLIA: 11155111,
  BSC: 56,
  BSC_TESTNET: 97,
} as const

export type ChainId = (typeof ChainId)[keyof typeof ChainId]

const bsc = _bsc as ChainConfig
const bscTestnet = _bscTestnet as ChainConfig
const ethereum = _ethereum as ChainConfig
const sepolia = _sepolia as ChainConfig

export const CHAINS: ChainMap<ChainConfig> = {
  [ChainId.ETHEREUM]: ethereum,
  [ChainId.SEPOLIA]: sepolia,
  [ChainId.BSC]: bsc,
  [ChainId.BSC_TESTNET]: bscTestnet,
}

// NOTE: Change default chainId depending on environment
export const defaultChainId = process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID
  ? (Number(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID) as ChainId)
  : ChainId.ETHEREUM

export const SUPPORTED_CHAINS: ChainId[] =
  defaultChainId === ChainId.SEPOLIA || defaultChainId === ChainId.BSC_TESTNET
    ? [ChainId.SEPOLIA, ChainId.BSC_TESTNET]
    : [ChainId.ETHEREUM, ChainId.BSC]
