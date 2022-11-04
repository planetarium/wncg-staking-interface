import { useCallback } from 'react'
import { useAtomValue } from 'jotai'

import { allowancesAtom } from 'states/user'

export function useAllowances() {
  const allowancesMap = useAtomValue(allowancesAtom)

  const allowanceMapFor = useCallback(
    (tokenAddress?: string) => {
      return allowancesMap[tokenAddress?.toLowerCase() || ''] || {}
    },
    [allowancesMap]
  )

  const allowanceFor = useCallback(
    (tokenAddress?: string, spender?: string) => {
      const allowanceMap = allowanceMapFor(tokenAddress)
      return allowanceMap[spender?.toLowerCase() || ''] || false
    },
    [allowanceMapFor]
  )

  return {
    allowanceFor,
  }
}
