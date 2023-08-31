import { YEAR } from 'config/constants/time'
import { bnum } from './bnum'

export function calcApr(
  emissionPerSec: string,
  tokenPrice: number | string,
  totalStakedValue: number | string
) {
  const apr = bnum(emissionPerSec)
    .times(YEAR)
    .times(tokenPrice)
    .div(totalStakedValue)
    .times(100)

  const isValid = !apr.isNaN() && apr.isFinite()
  return isValid ? apr.toString() : '0'
}
