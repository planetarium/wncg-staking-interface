import { atom, selector } from 'recoil'
import { configService } from 'services/config'

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

export const legacyModeState = atom<boolean>({
  key: '#legacyMode',
  default: false,
})

export const stakingContractAddressState = selector<string>({
  key: '#stakingContractAddress',
  get({ get }) {
    const isLegacyMode = get(legacyModeState)
    return isLegacyMode
      ? configService.legacyStakingAddress
      : configService.stakingAddress
  },
})
