import { parseUnits as _parseUnits } from 'viem'
import { bnum } from './bnum'

export function parseUnits(value?: string | null, decimals: number = 18) {
  return bnum(
    _parseUnits(
      bnum(value ?? '0').toFixed(18, 3) as `${number}`,
      decimals
    ).toString()
  )
}
