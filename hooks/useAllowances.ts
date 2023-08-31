import { useChain } from './useChain'
import { useFetchUserAllowances } from './queries'

export function useAllowances() {
  const { nativeCurrency } = useChain()
  const allowanceMap = useFetchUserAllowances().data ?? {}

  function allowanceOf(tokenAddress: Hash, spender: Hash) {
    if (tokenAddress === nativeCurrency.address) return Infinity
    return allowanceMap?.[tokenAddress]?.[spender] ?? '0'
  }

  return allowanceOf
}
