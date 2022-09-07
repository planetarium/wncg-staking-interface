import { atom, selector } from 'recoil'

const DEFAULT_SLIPPAGE = 1 // 1%

export const slippageState = atom<number | null>({
  key: '#slippage',
  default: DEFAULT_SLIPPAGE,
})

export const slippageSelector = selector({
  key: '#slippageSelector',
  get({ get }) {
    const slippage = get(slippageState)
    return slippage || DEFAULT_SLIPPAGE
  },
})

export const mutedState = atom<boolean>({
  key: '#muted',
  default: false,
})

export type EstimatedEarnPeriod = 'year' | 'month' | 'week' | 'day'

export const estimatedEarnPeriodState = atom<EstimatedEarnPeriod>({
  key: '#estimatedEarnPeriod',
  default: 'year',
})
