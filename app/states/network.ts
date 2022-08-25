import { atom, selector } from 'recoil'
import { Network } from '@balancer-labs/sdk'

export const networkId =
  process.env.NEXT_PUBLIC_NETWORK_ID != null
    ? (Number(process.env.NEXT_PUBLIC_NETWORK_ID) as Network)
    : Network.MAINNET

export const currentNetworkIdState = atom<null | Network>({
  key: '#currentNetworkId',
  default: null,
})

// Selectors
export const metamaskNotFoundState = selector({
  key: '#metamaskNotFound',
  get({ get }) {
    const currentNetworkId = get(currentNetworkIdState)
    return currentNetworkId === networkId
  },
})

export const networkMismatchState = selector({
  key: '#networkMismatch',
  get({ get }) {
    const currentNetworkId = get(currentNetworkIdState)
    return currentNetworkId === networkId
  },
})
