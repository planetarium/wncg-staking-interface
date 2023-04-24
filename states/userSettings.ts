import { atomWithStorage } from 'jotai/utils'

import storeKeys from 'constants/storageKeys'

export type EstimationPeriod = 'year' | 'month' | 'week' | 'day'

const DEFAULT_SLIPPAGE = 1 // NOTE: 1%

export const slippageAtom = atomWithStorage<number | null>(
  storeKeys.UserSettings.Slippage,
  DEFAULT_SLIPPAGE
)

export const mutedAtom = atomWithStorage(storeKeys.UserSettings.Muted, false)

export const estimationPeriodAtom = atomWithStorage<EstimationPeriod>(
  storeKeys.UserSettings.EstimationPeriod,
  'year'
)
