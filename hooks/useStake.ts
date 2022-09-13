import { useCallback } from 'react'

import { stakeBpt } from 'contracts/staking'
import { useStakingContract } from './useStakingContract'
import { useTx } from './useTx'

export function useStake() {
  const { contract } = useStakingContract(true)
  const { subscribeTx } = useTx()

  const stake = useCallback(
    async (amount: string) => {
      if (!contract) return
      const response = await stakeBpt(contract, amount)
      subscribeTx?.(response)
      return response.hash
    },
    [contract, subscribeTx]
  )

  return {
    stake,
  }
}
