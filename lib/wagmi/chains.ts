import { mainnet, sepolia, bsc, bscTestnet } from 'viem/chains'
import { configureChains } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'

import { apiKeys } from 'config/api'
import { rpcUrlFor } from './rpcUrlFor'

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, bsc, sepolia, bscTestnet],
  [
    jsonRpcProvider({
      rpc(chain) {
        return rpcUrlFor(chain.network)
      },
    }),
    infuraProvider({ apiKey: apiKeys.infura }),
    publicProvider(),
  ]
)
