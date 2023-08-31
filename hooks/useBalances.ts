import { useFetchUserBalances } from './queries'

export function useBalances() {
  const balanceMap = (useFetchUserBalances({ refetchOnWindowFocus: 'always' })
    .data ?? {}) as unknown as BalanceMap

  function balanceFor(tokenAddress: Hash) {
    return balanceMap[tokenAddress?.toLowerCase() as Hash] ?? '0'
  }

  return balanceFor
}
