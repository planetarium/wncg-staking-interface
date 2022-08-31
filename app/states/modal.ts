import { atom } from 'recoil'

export const ModalCategory = {
  ClaimReward: 'MODAL_CATEGORY_CLAIM_REWARD',
  Connect: 'MODAL_CATEGORY_CONNECT',
  Error: 'MODAL_CATEGORY_ERROR',
  JoinPreview: 'MODAL_JOIN_POOL_PREVIEW',
  MetaMaskGuide: 'MODAL_CATEGORY_METAMASK_GUIDE',
  StakeWarning: 'MODAL_CATEGORY_STAKE_WARNING',
  WithdrawPreview: 'MODAL_CATEGORY_WITHDRAW_PREVIEW',
} as const
export type ModalCategory = typeof ModalCategory[keyof typeof ModalCategory]

export type Modal = {
  category: ModalCategory
  props?: any
}

export const modalListState = atom<Modal[]>({
  key: '#modalList',
  default: [],
})
