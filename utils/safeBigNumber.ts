import { bnum } from './bnum'

export function safeBigNumber(value: string | number) {
  return bnum(value)
    .toNumber()
    .toLocaleString('fullwide', { useGrouping: false })
}
