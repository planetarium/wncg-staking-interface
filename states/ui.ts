import { atom } from 'jotai'
import { atomWithReset } from 'jotai/utils'

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export const ModalCategory = {
  ClaimReward: 'MODAL_CLAIM_REWARD',
  Connect: 'MODAL_CONNECT',
  Cooldown: 'MODAL_COOLDOWN',
  Error: 'MODAL_ERROR',
  Exit: 'MODAL_EXIT',
  Join: 'MODAL_JOIN',
  JoinPreview: 'MODAL_JOIN_POOL_PREVIEW',
  ExitPreview: 'MODAL_EXIT_POOL_PREVIEW',
  MetaMaskGuide: 'MODAL_METAMASK_GUIDE',
  Stake: 'MODAL_STAKE',
  StakeWarning: 'MODAL_STAKE_WARNING',
  SwitchNetwork: 'MODAL_SWITCH_NETWORK',
  Withdraw: 'MODAL_WITHDRAW',
  WithdrawPreview: 'MODAL_WITHDRAW_PREVIEW',
} as const
export type ModalCategory = typeof ModalCategory[keyof typeof ModalCategory]

export type Modal = {
  category: ModalCategory
  props?: any
}

export const breakpointAtom = atom<Breakpoint | null>(null)

export const modalsAtom = atomWithReset<Modal[]>([])

export const toastIdsAtom = atom<string[]>([])

// NOTE: Read-only Derived Atoms
export const isMobileAtom = atom((get) => {
  const bp = get(breakpointAtom)
  return ['xs', 'sm'].includes(bp || '')
})

export const isTabletAtom = atom((get) => {
  const bp = get(breakpointAtom)
  return bp === 'md'
})

export const isDesktopAtom = atom((get) => {
  const bp = get(breakpointAtom)
  return ['lg', 'xl'].includes(bp || '')
})

export const latestToastIdAtom = atom<string | null>((get) => {
  const list = get(toastIdsAtom)
  if (!list.length) return null
  return list[list.length - 1]
})
