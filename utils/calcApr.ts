import { YEAR_IN_SEC } from 'constants/time'
import { bnum } from './bnum'

export function calcApr(
  emissionPerSec: string,
  price: number | string,
  totalStakedValue: number | string
) {
  const apr = bnum(emissionPerSec)
    .times(price)
    .times(YEAR_IN_SEC)
    .div(totalStakedValue)
    .times(100)

  const isValid = !apr.isNaN() && apr.isFinite()
  return isValid ? apr.toString() : '0'
}