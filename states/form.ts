import { atom } from 'jotai'
import { atomWithReset, atomWithStorage } from 'jotai/utils'

import { configService } from 'services/config'

// NOTE: Stake Modal
type PendingStakeTx = {
  amount?: string
  hash?: Hash
}

export const pendingStakeTxAtom = atomWithStorage<PendingStakeTx>(
  `wncgStaking.pendingStake`,
  {}
)

// NOTE: Join Form
export const etherTypeAtom = atom(configService.nativeAssetAddress)
export const isNativeAssetAtom = atom((get) => {
  const currentEtherType = get(etherTypeAtom)
  return currentEtherType === configService.nativeAssetAddress
})
export const optimizeErrorAtom = atomWithReset(false)

type PendingJoinTx = {
  amounts?: string[]
  approving?: string
  assets?: string[]
  hash?: Hash
  tokensToApprove?: string[]
}

// NOTE: Join Modal
export const pendingJoinTxAtom = atomWithStorage<PendingJoinTx>(
  `wncgStaking.pendingJoin`,
  {}
)

type PendingExitTx = {
  bptOutPcnt?: number
  exitType?: string
  hash?: Hash
  tokenOutAmount?: string
}

// NOTE: Exit Modal
export const pendingExitTxAtom = atomWithStorage<PendingExitTx>(
  `wncgStaking.pendingExit`,
  {}
)

type PendingClaimTx = {
  tokensToClaim?: string[]
  rewardsToClaim?: string[]
  hash?: Hash
}

// NOTE: Claim Modal
export const pendingClaimTxAtom = atomWithStorage<PendingClaimTx>(
  `wncgStaking.pendingClaim`,
  {}
)
