import { ChainId } from 'config/chains'
import type { ChainMap } from 'config/types'

import _ethereum from './1.json'
import _goerli from './5.json'
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
const goerli = _goerli as DexInfo
const bsc = _bsc as DexInfo
const bscTestnet = _bscTestnet as DexInfo

export const DEX: ChainMap<DexInfo> = {
  [ChainId.ETHEREUM]: ethereum,
  [ChainId.GOERLI]: goerli,
  [ChainId.BSC]: bsc,
  [ChainId.BSC_TESTNET]: bscTestnet,
}
