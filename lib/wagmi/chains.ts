import { configureChains, mainnet } from 'wagmi'
import { goerli, bscTestnet, bsc } from 'wagmi/chains'
import { infuraProvider } from 'wagmi/providers/infura'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'

import { apiKeys } from 'config/api'
import config from 'config'

const chainList = config.isTestnet ? [goerli, bscTestnet] : [mainnet, bsc]

// NOTE: 식은땀
export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, bsc],
  [
    jsonRpcProvider({
      rpc(chain) {
        return nodeRealUrlFor(chain.network)
      },
    }),
    infuraProvider({ apiKey: apiKeys.infura }),
    publicProvider(),
  ]
)

function nodeRealUrlFor(networkName: string) {
  if (!apiKeys.nodeReal) return null

  let host = null

  switch (networkName) {
    case 'homestead':
      host = `eth-mainnet.nodereal.io/v1/${apiKeys.nodeReal}`
      break
    case 'goerli':
      host = `eth-goerli.nodereal.io/v1/${apiKeys.nodeReal}`
      break
    default:
      host = null
  }

  if (!host) return null

  const url = `https://${host}`

  return {
    http: url,
    webSocket: url
      .replace(/^https/i, 'wss')
      .replace('.nodereal.io/v1', '.nodereal.io/ws/v1'),
  }
}
