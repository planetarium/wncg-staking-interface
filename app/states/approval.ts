import { atom } from 'recoil'

export const approvalState = atom({
  key: '#approval',
  default: {
    bpt: false,
    weth: false,
    wncg: false,
  },
})
