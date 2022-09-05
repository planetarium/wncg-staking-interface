import { YEAR_IN_SEC } from 'constants/time'
import { bnum } from './num'

export function calcApr(
  emissionRate: string,
  price: number | string,
  totalStakedValue: number
) {
  const apr = bnum(emissionRate)
    .times(price)
    .times(YEAR_IN_SEC)
    .div(totalStakedValue)
    .times(100)

  const isValid = !apr.isNaN() && apr.isFinite()
  return isValid ? apr.toNumber() : 0
}
