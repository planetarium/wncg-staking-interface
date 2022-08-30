import { useCallback } from 'react'

import { stakeBpt } from 'contracts/staking'
import { TransactionAction } from 'services/transaction'
import { usePool } from './usePool'
import { useStakingContract } from './useStakingContract'
import { useTransaction } from './useTransaction'

export function useStake() {
  const { poolTokenName } = usePool()
  const contract = useStakingContract(true)
  const { registerTx } = useTransaction()

  const stake = useCallback(
    async (amount: string) => {
      if (!contract) return
      const response = await stakeBpt(contract, amount)
      registerTx?.(response, TransactionAction.Stake, [amount, poolTokenName])
      return response.hash
    },
    [contract, poolTokenName, registerTx]
  )

  return {
    stake,
  }
}
