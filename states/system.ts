import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const currentTimestampAtom = atom(0)

export const slippageAtom = atomWithStorage<string | null>(
  `wncg:staking:slippage`,
  null
)

export const periodFinishAtom = atom<string | null>(null)
export const showHarvestTooltipAtom = atomWithStorage(
  `wncg:staking:showHarvestTooltip`,
  false
)
