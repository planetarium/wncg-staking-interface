import { useCallback } from 'react'

import { earmarkRewards as initEarmarkRewards } from 'contracts/staking'
import { TxAction } from 'services/transaction'
import { useStakingContract } from './useStakingContract'
import { useTransaction } from './useTransaction'

export function useEarmark() {
  const contract = useStakingContract(true)
  const { registerTx } = useTransaction()

  const earmarkRewards = useCallback(async () => {
    if (!contract) return
    const response = await initEarmarkRewards(contract)
    registerTx?.(response, TxAction.EarmarkRewards)
  }, [contract, registerTx])

  return {
    earmarkRewards,
  }
}
