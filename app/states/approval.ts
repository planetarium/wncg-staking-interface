import { atom } from 'recoil'

export type ApprovalTokenSymbol = PoolTokenSymbol | PoolLpToken

export const approvalState = atom<Record<ApprovalTokenSymbol, boolean>>({
  key: '#approval',
  default: {
    bpt: false,
    weth: false,
    wncg: false,
  },
})
