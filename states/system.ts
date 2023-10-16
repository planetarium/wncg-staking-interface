import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const currentTimestampAtom = atom(0)
export const totalStakedAtom = atom<string | null>(null)

export type AssetPlatform = 'ethereum' | 'bsc'

export const assetPlatformAtom = atom<AssetPlatform>('ethereum')

export const currentChainAtom = atom<Chain | null>(null)

export const slippageAtom = atomWithStorage<string | null>(
  `wncg:staking:slippage`,
  null
)

export const periodFinishAtom = atom<string | null>(null)
export const showHarvestTooltipAtom = atomWithStorage(
  `wncg:staking:showHarvestTooltip`,
  false
)
