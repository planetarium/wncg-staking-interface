import { atom, selector } from 'recoil'

import { configService } from 'services/config'
import { currentNetworkIdState } from './connection'

export const invalidPriceState = atom<boolean>({
  key: '#invalidPrice',
  default: false,
})

export const networkMismatchState = selector({
  key: '#networkMismatch',
  get({ get }) {
    const currentNetworkId = get(currentNetworkIdState)
    return currentNetworkId !== configService.networkId
  },
})
