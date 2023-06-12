import { useCallback } from 'react'

import { bnum } from 'utils/bnum'
import { useFetchPrices } from './queries'
import { useStaking } from './useStaking'

export function useFiat() {
  const { priceMap: initPriceMap } = useStaking()

  const { data: priceMap = initPriceMap } = useFetchPrices()

  const toFiat = useCallback(
    (amount: string | number, tokenAddress: string) => {
      if (!tokenAddress) return '0'

      const price = priceMap[tokenAddress?.toLowerCase() as Hash] ?? '0'
      return bnum(amount).times(price).toFixed(18, 3)
    },
    [priceMap]
  )

  return toFiat
}
