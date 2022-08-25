import { atom } from 'recoil'

export const invalidPriceState = atom<boolean>({
  key: '#invalidPrice',
  default: false,
})
