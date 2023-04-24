import { configureChains } from 'wagmi'
import { goerli, mainnet } from 'wagmi/chains'

import { infuraProvider } from 'wagmi/providers/infura'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'

import { apiKeys } from 'config/api'

const CHAINS = [mainnet, goerli]

export const { chains, provider, webSocketProvider } = configureChains(CHAINS, [
  publicProvider(),
  infuraProvider({ apiKey: apiKeys.infura }),
  jsonRpcProvider({
    rpc(chain) {
      // return (
      //   nodeRealUrlFor(chain.network) ?? {
      //     http: chain.rpcUrls.default.http?.[0],
      //     webSocket: chain.rpcUrls.default.webSocket?.[0],
      //   }
      // )
      return nodeRealUrlFor(chain.network)
    },
  }),
])

function nodeRealUrlFor(networkName: string) {
  if (!apiKeys.nodeReal) return null
  // if (config.env !== 'production') return null

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
