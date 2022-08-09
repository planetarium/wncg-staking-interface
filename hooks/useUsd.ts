import { useRecoilValue } from 'recoil'

import { poolTokenPriceState } from 'app/states/pool'
import { assertUnreachable } from 'utils/assertion'
import Decimal, { sanitizeNumber } from 'utils/num'
import { useFetchTokenPrices } from './useFetchTokenPrices'

type Token = 'bal' | 'bpt' | 'weth' | 'wncg'

export function useUsd() {
  const { balPrice, wethPrice, wncgPrice } = useFetchTokenPrices()
  const bptPrice = useRecoilValue(poolTokenPriceState)

  function calculateBal(value: string | number) {
    return new Decimal(sanitizeNumber(value))
      .mul(sanitizeNumber(balPrice))
      .toNumber()
  }

  function calculateBpt(value: string | number) {
    return new Decimal(sanitizeNumber(value))
      .mul(sanitizeNumber(bptPrice))
      .toNumber()
  }

  function calculateWeth(value: string | number) {
    return new Decimal(sanitizeNumber(value))
      .mul(sanitizeNumber(wethPrice))
      .toNumber()
  }

  function calculateWncg(value: string | number) {
    return new Decimal(sanitizeNumber(value))
      .mul(sanitizeNumber(wncgPrice))
      .toNumber()
  }

  function calculateUsdValue(token: Token, value: string | number) {
    if (!value) return 0

    switch (token) {
      case 'bal':
        return calculateBal(value)
      case 'bpt':
        return calculateBpt(value)
      case 'weth':
        return calculateWeth(value)
      case 'wncg':
        return calculateWncg(value)
      default:
        assertUnreachable(token)
    }
  }

  return {
    calculateUsdValue,
  }
}
