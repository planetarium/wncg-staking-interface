import { bnum } from './bnum'

export function hasAmounts(amounts: string[]) {
  return amounts.some((amount) => bnum(amount).gt(0))
}
