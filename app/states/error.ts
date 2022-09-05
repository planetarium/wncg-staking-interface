import { atom, selector } from 'recoil'

import { configService } from 'services/config'
import { currentNetworkIdState } from './connection'

export const invalidPriceState = atom<boolean>({
  key: '#invalidPrice',
  default: false,
})

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
