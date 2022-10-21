import { atom } from 'jotai'
import { atomWithReset, atomWithStorage } from 'jotai/utils'

import { configService } from 'services/config'

// NOTE: Stake Modal
export const pendingStakeAmountAtom = atomWithStorage(
  `wncgStaking.stakeAmount`,
  ''
)
export const pendingStakeHashAtom = atomWithStorage<Hash | undefined>(
  `wncgStaking.stakeHash`,
  undefined
)

// NOTE: Join Modal
// FIXME: change defaultValue to ETH
export const etherTypeAtom = atom(configService.weth)
export const isNativeAssetAtom = atom((get) => {
  const currentEtherType = get(etherTypeAtom)
  return currentEtherType === configService.nativeAssetAddress
})
export const optimizeErrorAtom = atomWithReset(false)

export const pendingJoinAmountsAtom = atomWithStorage(
  `wncgStaking.joinAmounts`,
  ['']
)
export const pendingJoinAssetsAtom = atomWithStorage(`wncgStaking.joinAssets`, [
  '',
])
export const pendingJoinHashAtom = atomWithStorage<Hash | undefined>(
  `wncgStaking.joinHash`,
  undefined
)
