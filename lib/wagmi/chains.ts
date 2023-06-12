import { configureChains } from 'wagmi'

import { infuraProvider } from 'wagmi/providers/infura'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'

import { apiKeys } from 'config/api'
import { CHAINS } from 'config/chains'

export const { chains, provider, webSocketProvider } = configureChains(
  Object.values(CHAINS),
  [
    publicProvider(),
    infuraProvider({ apiKey: apiKeys.infura }),
    jsonRpcProvider({
      rpc(chain) {
        return nodeRealUrlFor(chain.network)
      },
    }),
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
