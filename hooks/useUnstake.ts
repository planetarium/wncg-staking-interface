import { useCallback } from 'react'

import { cooldown as initCooldown, unstakeBpt } from 'contracts/staking'
import { useStakingContract } from './useStakingContract'
import { useTx } from './useTx'

export function useUnstake() {
  const { contract } = useStakingContract(true)
  const { subscribeTx } = useTx()

  const startCooldown = useCallback(async () => {
    if (!contract) return
    const response = await initCooldown(contract)
    subscribeTx?.(response)
  }, [contract, subscribeTx])

  const withdraw = useCallback(
    async (amount: string, isClaimAllRewards: boolean) => {
      if (!contract) return
      const response = await unstakeBpt(contract, amount, isClaimAllRewards)
      subscribeTx?.(response)
    },
    [contract, subscribeTx]
  )

  return {
    startCooldown,
    withdraw,
  }
}
