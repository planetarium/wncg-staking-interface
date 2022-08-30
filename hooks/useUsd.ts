import { isAddress } from 'ethers/lib/utils'
import { useCallback } from 'react'

import { bnum } from 'utils/num'
import { findTokenAddressBySymbol } from 'utils/token'
import { useTokenPrices } from './useTokenPrices'

export function useUsd() {
  const { bptPrice, priceFor } = useTokenPrices()

  function getFiatValue(token?: string, value?: string | number) {
    if (!token || !value) return 0

    let address = token
    if (!isAddress(address)) {
      address = findTokenAddressBySymbol(token)
    }
    const price = priceFor(address)

    return bnum(value).times(price).toNumber()
  }

  const getBptFiatValue = useCallback(
    (value?: string | number) => {
      if (!value) return 0
      return bnum(value).times(bptPrice).toNumber()
    },
    [bptPrice]
  )

  return {
    getBptFiatValue,
    getFiatValue,
  }
}
