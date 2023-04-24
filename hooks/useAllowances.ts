import config from 'config'
import { useFetchUserAllowances } from './queries'

export function useAllowances() {
  const allowanceMap = useFetchUserAllowances().data ?? {}

  function allowanceFor(tokenAddress: Hash, spender: Hash) {
    if (tokenAddress === config.nativeCurrency.address) return Infinity
    return allowanceMap?.[tokenAddress]?.[spender] ?? '0'
  }

  return allowanceFor
}
