import { atom } from 'jotai'
import { atomWithReset } from 'jotai/utils'

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export const ModalCategory = {
  ClaimReward: 'MODAL_CATEGORY_CLAIM_REWARD',
  Connect: 'MODAL_CATEGORY_CONNECT',
  Error: 'MODAL_CATEGORY_ERROR',
  JoinPreview: 'MODAL_JOIN_POOL_PREVIEW',
  ExitPreview: 'MODAL_EXIT_POOL_PREVIEW',
  MetaMaskGuide: 'MODAL_CATEGORY_METAMASK_GUIDE',
  StakeWarning: 'MODAL_CATEGORY_STAKE_WARNING',
  WithdrawPreview: 'MODAL_CATEGORY_WITHDRAW_PREVIEW',
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
