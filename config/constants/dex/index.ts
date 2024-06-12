import { ChainId } from 'config/chains'
import type { ChainMap } from 'config/types'

import _ethereum from './1.json'
import _sepolia from './11155111.json'
import _bsc from './56.json'
import _bscTestnet from './97.json'

type DexInfo = {
  chainId: ChainId
  network: string
  dexPlatform: string
  dexPlatformName: string
  dexPlatformUrl: string
  dexPoolId: string
}

const ethereum = _ethereum as DexInfo
const sepolia = _sepolia as DexInfo
const bsc = _bsc as DexInfo
const bscTestnet = _bscTestnet as DexInfo

export const DEX: ChainMap<DexInfo> = {
  [ChainId.ETHEREUM]: ethereum,
  [ChainId.SEPOLIA]: sepolia,
  [ChainId.BSC]: bsc,
  [ChainId.BSC_TESTNET]: bscTestnet,
}
