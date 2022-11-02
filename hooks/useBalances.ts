import { useCallback, useMemo } from 'react'
import { useAtomValue } from 'jotai'

import { balancesAtom } from 'states/user'
import { bnum } from 'utils/num'
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

  const hasBptBalance = useMemo(() => bnum(bptBalance).gt(0), [bptBalance])

  return {
    balanceFor,
    bptBalance,
    hasBptBalance,
  }
}
