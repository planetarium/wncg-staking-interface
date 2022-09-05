import { atom, selector } from 'recoil'
import { bnum } from 'utils/num'

export const slippageState = atom<number | null>({
  key: '#slippage',
  default: 0.005,
})

export const slippageSelector = selector({
  key: '#slippageSelector',
  get({ get }) {
    const slippage = get(slippageState)
    return slippage ? bnum(slippage).div(100).toNumber() : 0.01
  },
})
