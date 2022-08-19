import { atom, selector } from 'recoil'

export type ApprovalTokenSymbol = PoolTokenSymbol | PoolLpToken

export const approvalState = atom<Record<ApprovalTokenSymbol, boolean>>({
  key: '#approval',
  default: {
    bpt: false,
    weth: false,
    wncg: false,
  },
})

export const poolTokenApprovalsState = selector<boolean[]>({
  key: '#poolTokenApproval',
  get({ get }) {
    const { weth, wncg } = get(approvalState)
    return [wncg, weth]
  },
})
