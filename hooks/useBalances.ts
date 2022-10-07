import { useCallback, useMemo } from 'react'
import { useAtomValue } from 'jotai'

import { stakedTokenAddressAtom } from 'states/staking'
import { balancesAtom } from 'states/user'

export function useBalances() {
  const balanceMap = useAtomValue(balancesAtom)
  const stakedTokenAddress = useAtomValue(stakedTokenAddressAtom)

  const balanceFor = useCallback(
    (address?: string) => {
      return balanceMap[address?.toLowerCase() || ''] || '0'
    },
    [balanceMap]
  )

  const bptBalance = useMemo(
    () => balanceFor(stakedTokenAddress),
    [balanceFor, stakedTokenAddress]
  )

  return {
    balanceFor,
    bptBalance,
  }
}
