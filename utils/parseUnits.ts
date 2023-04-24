import { parseUnits as _parseUnits } from 'ethers/lib/utils'
import { bnum } from './bnum'

export function parseUnits(value?: string | null, decimals: number = 18) {
  return bnum(
    _parseUnits(bnum(value ?? '0').toFixed(18, 3), decimals).toString()
  )
}
