import { useCallback } from 'react'
import store from 'store'

import { handleError } from 'utils/error'
import {
  STORE_EARMARK_INCENTIVE_FEE_KEY,
  STORE_FEE_DENOMINATOR_KEY,
} from 'constants/storeKeys'
import { useStakingContract } from './useStakingContract'

export function useFee() {
  const contract = useStakingContract()

  const earmarkIncentiveFee = useCallback(async () => {
    const storedValue = store.get(STORE_EARMARK_INCENTIVE_FEE_KEY)
    if (!!storedValue) return storedValue
    if (!contract) return

    try {
      const rawFee = await contract.earmarkIncentive()
      const fee = rawFee.toNumber()
      store.set(STORE_EARMARK_INCENTIVE_FEE_KEY, fee)
      return fee
    } catch (error) {
      handleError(error)
    }
  }, [contract])

  const feeDenominator = useCallback(async () => {
    const storedValue = store.get(STORE_FEE_DENOMINATOR_KEY)
    if (!!storedValue) return storedValue
    if (!contract) return

    try {
      const rawDenominator = await contract.FEE_DENOMINATOR()
      const denominator = rawDenominator.toNumber()
      store.set(STORE_FEE_DENOMINATOR_KEY, denominator)
      return denominator
    } catch (error) {
      handleError(error)
    }
  }, [contract])

  return {
    earmarkIncentiveFee,
    feeDenominator,
  }
}
