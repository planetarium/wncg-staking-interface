import { Network } from '@balancer-labs/sdk'

import goerli from './goerli.json'
import homestead from './homestead.json'
import kovan from './kovan.json'

export interface Config {
  key: string
  chainId: Network
  chainName: string
  name: string
  shortName: string
  network: string
  explorer: string
  explorerName: string
  subgraph: string
  nativeAsset: {
    name: string
    address: string
    symbol: string
    decimals: number
    deeplinkId: string
    logoURI: string
    minTransactionBuffer: string
  }
  addresses: {
    bal: string
    vault: string
    weth: string
  }
}

const config: Record<Network | number, Config> = {
  [Network.MAINNET]: homestead,
  [Network.GOERLI]: goerli,
  [Network.KOVAN]: kovan,
}

export default config
