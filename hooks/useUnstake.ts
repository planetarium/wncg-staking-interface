import { useCallback } from 'react'

import { cooldown as initCooldown, unstakeBpt } from 'contracts/staking'
import { TxAction } from 'services/transaction'
import { usePool } from './usePool'
import { useStakingContract } from './useStakingContract'
import { useTx } from './useTx'

export function useUnstake() {
  const { poolTokenName } = usePool()
  const { contract } = useStakingContract(true)
  const { registerTx } = useTx()

  const startCooldown = useCallback(async () => {
    if (!contract) return
    const response = await initCooldown(contract)
    registerTx?.(response.hash, TxAction.Cooldown)
  }, [contract, registerTx])

  const withdraw = useCallback(
    async (amount: string, isClaimAllRewards: boolean) => {
      if (!contract) return
      const response = await unstakeBpt(contract, amount, isClaimAllRewards)
      const action = isClaimAllRewards
        ? TxAction.WithdrawAndClaim
        : TxAction.Withdraw
      registerTx?.(response.hash, action, [amount, poolTokenName])
    },
    [contract, poolTokenName, registerTx]
  )

  return {
    startCooldown,
    withdraw,
  }
}
