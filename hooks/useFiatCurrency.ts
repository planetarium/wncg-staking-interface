import { useCallback } from 'react'
import { isAddress } from 'ethers/lib/utils'

import { bnum } from 'utils/num'
import { findTokenAddressBySymbol } from 'utils/token'
import { usePrices } from './usePrices'

export function useFiatCurrency() {
  const { bptPrice, priceFor } = usePrices()

  function toFiat(token?: string, value?: string | number) {
    if (!token || !value) return 0

    let address = token
    if (!isAddress(address)) {
      address = findTokenAddressBySymbol(token)
    }
    const price = priceFor(address)

    return bnum(value).times(price).toNumber()
  }

  const bptToFiat = useCallback(
    (value?: string | number) => {
      if (!value) return 0
      return bnum(value).times(bptPrice).toNumber()
    },
    [bptPrice]
  )

  return {
    bptToFiat,
    toFiat,
  }
}
