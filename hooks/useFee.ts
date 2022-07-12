import { useCallback } from 'react'
import store from 'store'

import { useContract } from './useContract'
import { useError } from './useError'

const STORE_EARMARK_INCENTIVE_FEE_KEY = `wncgStaking.earmarkIncentiveFee`
const STORE_FEE_DENOMINATOR_KEY = `wncgStaking.feeDenominator`

export function useFee() {
  const contract = useContract()
  const { handleError } = useError()

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
  }, [contract, handleError])

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
  }, [contract, handleError])

  return {
    earmarkIncentiveFee,
    feeDenominator,
  }
}
