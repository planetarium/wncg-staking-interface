import { useCallback } from 'react'

import { initCooldown, unstakeBpt } from 'contracts/staking'
import { TransactionAction } from 'services/transaction'
import { usePool } from './usePool'
import { useStakingContract } from './useStakingContract'
import { useTransaction } from './useTransaction'

export function useUnstake() {
  const { poolTokenName } = usePool()
  const contract = useStakingContract(true)
  const { registerTx } = useTransaction()

  const startCooldown = useCallback(async () => {
    if (!contract) return
    const response = await initCooldown(contract)
    registerTx?.(response, TransactionAction.StartCooldown)
  }, [contract, registerTx])

  const withdraw = useCallback(
    async (amount: string, isClaimAllRewards: boolean) => {
      if (!contract) return
      const response = await unstakeBpt(contract, amount, isClaimAllRewards)
      const action = isClaimAllRewards
        ? TransactionAction.WithdrawAndClaim
        : TransactionAction.Withdraw
      registerTx?.(response, action, [amount, poolTokenName])
    },
    [contract, poolTokenName, registerTx]
  )

  return {
    startCooldown,
    withdraw,
  }
}
