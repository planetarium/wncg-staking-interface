import {
  getBalPrice,
  getBptPrice,
  getWethPrice,
  getWncgPrice,
} from 'app/states/token'
import { assertUnreachable } from 'utils/assertion'
import Decimal, { sanitizeNumber } from 'utils/num'
import { useAppSelector } from './useRedux'

type Token = 'bal' | 'bpt' | 'weth' | 'wncg'

export function useUsd() {
  const balPrice = useAppSelector(getBalPrice)
  const bptPrice = useAppSelector(getBptPrice)
  const wethPrice = useAppSelector(getWethPrice)
  const wncgPrice = useAppSelector(getWncgPrice)

  function calculateBal(value: string | number) {
    if (!balPrice) return 0
    return new Decimal(sanitizeNumber(value)).mul(balPrice).toNumber()
  }

  function calculateBpt(value: string | number) {
    if (!bptPrice) return 0
    return new Decimal(sanitizeNumber(value)).mul(bptPrice).toNumber()
  }

  function calculateWeth(value: string | number) {
    if (!wethPrice) return 0
    return new Decimal(sanitizeNumber(value)).mul(wethPrice).toNumber()
  }

  function calculateWncg(value: string | number) {
    if (!wncgPrice) return 0
    return new Decimal(sanitizeNumber(value)).mul(wncgPrice).toNumber()
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
