import { useCallback } from 'react'

import {
  claimAllRewards as initClaimAllRewards,
  claimBalRewards as initClaimBalRewards,
  claimWncgRewards as initClaimWncgRewards,
} from 'contracts/staking'
import { useRewards } from './useRewards'
import { useStakingContract } from './useStakingContract'
import { useTx } from './useTx'

export function useClaim() {
  const { scaledRewards } = useRewards()
  const { contract } = useStakingContract(true)
  const { subscribeTx } = useTx()

  const claimAllRewards = useCallback(async () => {
    if (!contract) return
    const response = await initClaimAllRewards(contract)
    subscribeTx?.(response)
  }, [contract, subscribeTx])

  const claimBalRewards = useCallback(async () => {
    if (!contract) return
    const response = await initClaimBalRewards(contract)
    subscribeTx?.(response)
  }, [contract, subscribeTx])

  const claimWncgRewards = useCallback(async () => {
    if (!contract) return
    const response = await initClaimWncgRewards(
      contract,
      scaledRewards[0].toString()
    )
    subscribeTx?.(response)
  }, [contract, scaledRewards, subscribeTx])

  return {
    claimAllRewards,
    claimBalRewards,
    claimWncgRewards,
  }
}
