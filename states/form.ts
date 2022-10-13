import { atomWithStorage } from 'jotai/utils'

// NOTE: Stake Modal
export const pendingStakeAmountAtom = atomWithStorage(
  `wncgStaking.stakeAmount`,
  ''
)
export const pendingStakeHashAtom = atomWithStorage<Hash | undefined>(
  `wncgStaking.stakeHash`,
  undefined
)
