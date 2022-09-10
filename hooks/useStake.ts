import { useCallback } from 'react'

import { stakeBpt } from 'contracts/staking'
import { TxAction } from 'services/transaction'
import { usePool } from './usePool'
import { useStakingContract } from './useStakingContract'
import { useTx } from './useTx'

export function useStake() {
  const { poolTokenName } = usePool()
  const { contract } = useStakingContract(true)
  const { registerTx } = useTx()

  const stake = useCallback(
    async (amount: string) => {
      if (!contract) return
      const response = await stakeBpt(contract, amount)
      registerTx?.(response.hash, TxAction.Stake, [amount, poolTokenName])
      return response.hash
    },
    [contract, poolTokenName, registerTx]
  )

  return {
    stake,
  }
}
