import { atom } from 'recoil'

export const priceErrorState = atom<boolean>({
  key: '#priceError',
  default: false,
})
