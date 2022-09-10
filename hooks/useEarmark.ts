import { useCallback } from 'react'

import { earmarkRewards as initEarmarkRewards } from 'contracts/staking'
import { TxAction } from 'services/transaction'
import { useStakingContract } from './useStakingContract'
import { useTx } from './useTx'

export function useEarmark() {
  const { contract } = useStakingContract(true)
  const { registerTx } = useTx()

  const earmarkRewards = useCallback(async () => {
    if (!contract) return
    const response = await initEarmarkRewards(contract)
    registerTx?.(response.hash, TxAction.EarmarkRewards)
  }, [contract, registerTx])

  return {
    earmarkRewards,
  }
}
