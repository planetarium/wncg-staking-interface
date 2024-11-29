import { atomWithStorage } from 'jotai/utils'

export const approveTxAtom = atomWithStorage<ApproveTx>(
  `wncg:staking:approveTx`,
  {}
)

export const claimTxAtom = atomWithStorage<ClaimTx>(`wncg:staking:claimTx`, {})

export const cooldownTxAtom = atomWithStorage<CooldownTx>(
  `wncg:staking:cooldownTx`,
  {}
)

export const harvestTxAtom = atomWithStorage<HarvestTx>(
  `wncg:staking:harvestTx`,
  {}
)

export const stakeTxAtom = atomWithStorage<StakeTx>(`wncg:staking:stakeTx`, {})

export const unstakeTxAtom = atomWithStorage<UnstakeTx>(
  `wncg:staking:unstakeTx`,
  {}
)

export const joinTxAtom = atomWithStorage<JoinTx>(`wncg:staking:joinTx`, {})

export const exitTxAtom = atomWithStorage<Partial<ExitTx>>(`wncg:staking:exitTx`, {})

export const addLiquidityTxAtom = atomWithStorage<AddLiquidityTx>(
  `wncg:staking:addLiquidityTx`,
  {}
)

export const removeLiquidityTxAtom = atomWithStorage<RemoveLiquidityTx>(
  `wncg:staking:removeLiquidityTx`,
  {}
)
