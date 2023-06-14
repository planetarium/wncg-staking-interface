import JSBI from 'jsbi'

import { bnum } from './bnum'

const MULTIPLE = 10000
const BIPS_BASE = JSBI.BigInt(MULTIPLE)

export function calcSlippageAmount(value: string, slippage: string) {
  const scaledSlippage = bnum(slippage).div(100).times(MULTIPLE).toString()
  const bSlippage = bnum(scaledSlippage)

  if (bSlippage.lt(0) || bSlippage.gt(MULTIPLE)) {
    throw Error(`Unexpected slippage value: ${slippage}`)
  }

  return [
    JSBI.divide(
      JSBI.multiply(
        JSBI.BigInt(value),
        JSBI.BigInt(bnum(10000).minus(scaledSlippage).toString())
      ),
      BIPS_BASE
    ).toString(),
    JSBI.divide(
      JSBI.multiply(
        JSBI.BigInt(value),
        JSBI.BigInt(bnum(10000).plus(scaledSlippage).toString())
      ),
      BIPS_BASE
    ).toString(),
  ]
}
