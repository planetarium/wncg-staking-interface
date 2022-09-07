import { Network } from '@balancer-labs/sdk'

import config from 'config'

export const networkChainId =
  process.env.NEXT_PUBLIC_NETWORK_ID != null
    ? (Number(process.env.NEXT_PUBLIC_NETWORK_ID) as Network)
    : Network.MAINNET

export function networkFor(key: string | number): Network {
  switch (key.toString()) {
    case '1':
      return Network.MAINNET
    case '5':
      return Network.GOERLI
    case '42':
      return Network.KOVAN
    default:
      throw new Error('Network not supported')
  }
}

export function networkNameFor(network: Network): string {
  return config[network].shortName
}

export function explorerUrlFor(network: Network): string {
  return config[network].explorer
}

export function convertChainIdToHex(network: Network): string {
  return `0x${network.toString(16)}`
}

export function balancerUrlFor(network: Network) {
  let networkName = networkNameFor(network).toLowerCase()
  if (network === Network.MAINNET) networkName = 'app'
  return `https://${networkName}.balancer.fi/#`
}
