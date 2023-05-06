import { atomWithReset, atomWithStorage, selectAtom } from 'jotai/utils'

export const showMyStakingAtom = atomWithReset(false)
export const showPoolAtom = atomWithReset(false)

export const hideJoinTooltipAtom = atomWithStorage(
  `launchpad:staking:hideJoinTooltip`,
  false
)

export const modalAtom = atomWithReset<Modal | null>(null)
export const hasModalInViewAtom = selectAtom(
  modalAtom,
  (modal) => modal != null
)
