import { useCallback } from 'react'

import {
  claimAllRewards as initClaimAllRewards,
  claimBalRewards as initClaimBalRewards,
  claimWncgRewards as initClaimWncgRewards,
} from 'contracts/staking'
import { TransactionAction } from 'services/transaction'
import { useRewards } from './useRewards'
import { useStakingContract } from './useStakingContract'
import { useTransaction } from './useTransaction'

export function useClaim() {
  const { rewardTokenSymbols, scaledRewards } = useRewards()
  const contract = useStakingContract(true)
  const { registerTx } = useTransaction()

  const claimAllRewards = useCallback(async () => {
    if (!contract) return
    const response = await initClaimAllRewards(contract)
    registerTx?.(
      response,
      TransactionAction.ClaimAllRewards,
      rewardTokenSymbols[0]
    )
  }, [contract, rewardTokenSymbols, registerTx])

  const claimBalRewards = useCallback(async () => {
    if (!contract) return
    const response = await initClaimBalRewards(contract)
    registerTx?.(response, TransactionAction.ClaimBalRewards)
  }, [contract, registerTx])

  const claimWncgRewards = useCallback(async () => {
    if (!contract) return
    const response = await initClaimWncgRewards(
      contract,
      scaledRewards[0].toString()
    )
    registerTx?.(
      response,
      TransactionAction.ClaimWncgRewards,
      rewardTokenSymbols[0]
    )
  }, [contract, rewardTokenSymbols, scaledRewards, registerTx])

  return {
    claimAllRewards,
    claimBalRewards,
    claimWncgRewards,
  }
}
