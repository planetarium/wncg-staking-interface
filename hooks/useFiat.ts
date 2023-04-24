import { useCallback } from 'react'
import { useAtomValue } from 'jotai'

import { priceMapAtom } from 'states/system'
import { bnum } from 'utils/bnum'

export function useFiat() {
  const priceMap = useAtomValue(priceMapAtom)

  const toFiat = useCallback(
    (amount: string | number, tokenAddress: string) => {
      if (!tokenAddress) return '0'

      const price = priceMap[tokenAddress?.toLowerCase() as Hash] ?? '0'
      return bnum(amount).times(price).toString()
    },
    [priceMap]
  )

  return toFiat
}
