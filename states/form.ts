import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import config from 'config'
import { NATIVE_CURRENCY_ADDRESS } from 'config/constants/addresses'

type PendingTx = {
  hash?: Hash
}

// NOTE: Stake Modal
type PendingStakeTx = {
  amount?: string
} & PendingTx

export const pendingStakeTxAtom = atomWithStorage<PendingStakeTx>(
  `wncgStaking.pendingStake`,
  {}
)

// NOTE: Join Form
export const etherTypeAtom = atom(NATIVE_CURRENCY_ADDRESS)
export const isNativeAssetAtom = atom((get) => {
  const currentEtherType = get(etherTypeAtom)
  return currentEtherType === config.nativeCurrency.address
})

type PendingJoinTx = {
  amounts?: string[]
  approving?: string
  assets?: string[]
  tokensToApprove?: string[]
} & PendingTx

// NOTE: Join Modal
export const pendingJoinTxAtom = atomWithStorage<PendingJoinTx>(
  `wncgStaking.pendingJoin`,
  {}
)

type PendingExitTx = {
  bptOutPcnt?: number
  exitType?: string
  tokenOutAmount?: string
} & PendingTx

// NOTE: Exit Modal
export const pendingExitTxAtom = atomWithStorage<PendingExitTx>(
  `wncgStaking.pendingExit`,
  {}
)

type PendingClaimTx = {
  tokensToClaim?: string[]
  rewardsToClaim?: string[]
} & PendingTx

// NOTE: Claim Modal
export const pendingClaimTxAtom = atomWithStorage<PendingClaimTx>(
  `wncgStaking.pendingClaim`,
  {}
)

// NOTE: Cooldown Modal
export const pendingCooldownTxAtom = atomWithStorage<PendingTx>(
  `wncgStaking.pendingCooldown`,
  {}
)
