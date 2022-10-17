import { useCallback, useMemo } from 'react'
import { useAtomValue } from 'jotai'

import { balancesAtom } from 'states/user'
import { useStaking } from './contracts'

export function useBalances() {
  const { stakedTokenAddress } = useStaking()

  const balanceMap = useAtomValue(balancesAtom)

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
