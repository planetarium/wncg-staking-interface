import { createPublicClient as _createPublicClient, http } from 'viem'
import { bsc, bscTestnet, sepolia, mainnet } from 'viem/chains'

import { ChainId } from 'config/chains'
import { rpcUrlFor } from './rpcUrlFor'

export function createPublicClient(chainId: ChainId) {
  let chain: Chain = mainnet

  switch (chainId) {
    case ChainId.SEPOLIA:
      chain = sepolia
      break
    case ChainId.BSC:
      chain = bsc
      break
    case ChainId.BSC_TESTNET:
      chain = bscTestnet
      break
    default:
      break
  }

  return _createPublicClient({
    chain,
    transport: http(rpcUrlFor(chain.network)?.http),
  })
}
