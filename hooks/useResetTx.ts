import { useCallback } from 'react'
import { useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'

import {
  approveTxAtom,
  claimTxAtom,
  cooldownTxAtom,
  harvestTxAtom,
  stakeTxAtom,
  unstakeTxAtom,
  joinTxAtom,
  exitTxAtom,
  addLiquidityTxAtom,
  removeLiquidityTxAtom,
} from 'states/tx'

export function useResetTx() {
  const setApproveTx = useSetAtom(approveTxAtom)
  const setClaimTx = useSetAtom(claimTxAtom)
  const setCooldownTx = useSetAtom(cooldownTxAtom)
  const setHarvestTx = useSetAtom(harvestTxAtom)
  const setStakeTx = useSetAtom(stakeTxAtom)
  const setUnstakeTx = useSetAtom(unstakeTxAtom)
  const setJoinTx = useSetAtom(joinTxAtom)
  const setExitTx = useSetAtom(exitTxAtom)
  const setAddLiquidityTx = useSetAtom(addLiquidityTxAtom)
  const setRemoveLiquidityTx = useSetAtom(removeLiquidityTxAtom)

  const resetTx = useCallback(() => {
    setApproveTx(RESET)
    setClaimTx(RESET)
    setCooldownTx(RESET)
    setHarvestTx(RESET)
    setStakeTx(RESET)
    setUnstakeTx(RESET)
    setJoinTx(RESET)
    setExitTx(RESET)
    setAddLiquidityTx(RESET)
    setRemoveLiquidityTx(RESET)
  }, [
    setAddLiquidityTx,
    setApproveTx,
    setClaimTx,
    setCooldownTx,
    setExitTx,
    setHarvestTx,
    setJoinTx,
    setRemoveLiquidityTx,
    setStakeTx,
    setUnstakeTx,
  ])

  return resetTx
}
