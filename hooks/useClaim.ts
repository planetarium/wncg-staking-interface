import { useCallback } from 'react'

// import { addTx, TransactionAction } from 'app/states/transaction'
import { etherToWei } from 'utils/num'
import { useStakingContract } from './useStakingContract'
import { useAppDispatch } from './useRedux'
import { useToast } from './useToast'
import { useRewardData } from 'hooks'

export function useClaim() {
  const contract = useStakingContract(true)
  const { addToast } = useToast()

  const dispatch = useAppDispatch()

  const { rewards } = useRewardData()
  const earnedWncg = rewards[0]

  const claimAllRewards = useCallback(async () => {
    const data = await contract?.claimAllRewards()
    if (data) {
      // const tx = {
      //   hash: data.hash,
      //   action: TransactionAction.ClaimAllRewards,
      //   summary: 'Claim WNCG & BAL rewards',
      // }
      // dispatch(addTx(tx))
      // addToast(tx, `${data.hash}_claimAll`)
    }
  }, [addToast, contract, dispatch])

  const claimBalRewards = useCallback(async () => {
    const data = await contract?.claimBALRewards()
    // if (data) {
    //   const tx = {
    //     hash: data.hash,
    //     action: TransactionAction.ClaimBalRewards,
    //     summary: 'Claim BAL reward',
    //   }
    //   dispatch(addTx(tx))
    //   addToast(tx, data.hash)
    // }
  }, [addToast, contract, dispatch])

  const claimWncgRewards = useCallback(async () => {
    const data = await contract?.claimWNCGRewards(etherToWei(earnedWncg))
    // if (data) {
    //   const tx = {
    //     hash: data.hash,
    //     action: TransactionAction.ClaimWncgRewards,
    //     summary: 'Claim WNCG reward',
    //   }
    //   dispatch(addTx(tx))
    //   addToast(tx, data.hash)
    // }
  }, [addToast, contract, dispatch, earnedWncg])

  return {
    claimAllRewards,
    claimBalRewards,
    claimWncgRewards,
  }
}
