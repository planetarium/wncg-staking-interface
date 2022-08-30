import { atom, selector } from 'recoil'
import { Network } from '@balancer-labs/sdk'

import { configService } from 'services/config'

export const currentNetworkIdState = atom<null | Network>({
  key: '#currentNetworkId',
  default: null,
})

// Selectors
export const metamaskNotFoundState = selector({
  key: '#metamaskNotFound',
  get({ get }) {
    const currentNetworkId = get(currentNetworkIdState)
    return currentNetworkId === null
  },
})

export const networkMismatchState = selector({
  key: '#networkMismatch',
  get({ get }) {
    const currentNetworkId = get(currentNetworkIdState)
    return currentNetworkId !== configService.networkId
  },
})
