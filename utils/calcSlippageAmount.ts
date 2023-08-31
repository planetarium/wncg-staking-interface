import { bnum } from './bnum'

const MULTIPLE = 10000
const BIPS_BASE = BigInt(MULTIPLE)

export function calcSlippageAmount(value: string, slippage: string) {
  const scaledSlippage = bnum(slippage).div(100).times(MULTIPLE).toNumber()
  const bSlippage = bnum(scaledSlippage)

  if (bSlippage.lt(0) || bSlippage.gt(MULTIPLE)) {
    throw Error(`Unexpected slippage value: ${slippage}`)
  }

  return [
    (BigInt(10000 - scaledSlippage).valueOf() * BigInt(value)) / BIPS_BASE,
    (BigInt(10000 + scaledSlippage).valueOf() * BigInt(value)) / BIPS_BASE,
  ]
}
