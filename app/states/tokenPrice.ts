import { atom } from 'recoil'

export const tokenPriceState = atom<TokenPrice>({
  key: '#tokenPriceState',
  default: {},
})
