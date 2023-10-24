import { apiKeys } from 'config/api'

export function rpcUrlFor(networkName: string) {
  if (!apiKeys.nodeReal) return null

  let host = null

  switch (networkName) {
    case 'homestead':
      host = `eth-mainnet.nodereal.io/v1/${apiKeys.nodeReal}`
      break

    case 'goerli':
      host = `eth-goerli.nodereal.io/v1/${apiKeys.nodeReal}`
      break

    case 'bsc':
      host = `bsc-mainnet.nodereal.io/v1/${apiKeys.nodeReal}`
      break

    case 'bsc-testnet':
      host = `bsc-testnet.nodereal.io/v1/${apiKeys.nodeReal}`
      break

    default:
      break
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
