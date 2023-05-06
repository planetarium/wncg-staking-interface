import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const currentTimestampAtom = atom(0)
export const priceMapAtom = atom<PriceMap>({})
export const totalStakedAtom = atom<string | null>(null)

export const currentChainAtom = atom<Chain | null>(null)
export const currentChainIdAtom = atom<Network | null>(
  (get) => (get(currentChainAtom)?.id as Network) ?? null
)

export const slippageAtom = atomWithStorage<string | null>(
  `wncg:staking:slippage`,
  null
)

export const isHarvestableAtom = atom(false)
export const showHarvestTooltipAtom = atomWithStorage(
  `wncg:staking:showHarvestTooltip`,
  false
)
