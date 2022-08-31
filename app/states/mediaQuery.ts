import { atom, selector } from 'recoil'

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export const breakpointState = atom<Breakpoint | null>({
  key: '#breakpoint',
  default: null,
})

export const isMobileState = selector({
  key: '#isMobile',
  get({ get }) {
    const bp = get(breakpointState)
    return ['xs', 'sm'].includes(bp || '')
  },
})

export const isTabletState = selector({
  key: '#isTablet',
  get({ get }) {
    const bp = get(breakpointState)
    return bp === 'md'
  },
})

export const isDesktopState = selector({
  key: '#isDesktop',
  get({ get }) {
    const bp = get(breakpointState)
    return ['lg', 'xl'].includes(bp || '')
  },
})
