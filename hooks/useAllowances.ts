import { NATIVE_CURRENCY_ADDRESS } from 'config/constants/addresses'
import { useFetchUserAllowances } from './queries'

export function useAllowances() {
  const allowanceMap = useFetchUserAllowances().data ?? {}

  function allowanceFor(tokenAddress: Hash, spender: Hash) {
    if (tokenAddress === NATIVE_CURRENCY_ADDRESS) return Infinity
    return allowanceMap?.[tokenAddress]?.[spender] ?? '0'
  }

  return allowanceFor
}
