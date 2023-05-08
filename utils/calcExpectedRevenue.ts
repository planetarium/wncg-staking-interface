import { bnum } from './bnum'

const PERIOD_MAP = {
  day: bnum(1).div(365),
  week: bnum(1).div(52),
  month: bnum(1).div(12),
  year: bnum(1),
}

export type ExpectedRevenueMap = {
  day: string
  week: string
  month: string
  year: string
}

export function calcExpectedRevenue(
  amount: string,
  apr: string,
  bptPrice: string,
  tokenPrice: string
): ExpectedRevenueMap {
  const entries = Object.entries(PERIOD_MAP).map(([span, rate]) => {
    const revenue = bnum(amount)
      .times(apr)
      .times(rate)
      .times(bptPrice)
      .div(tokenPrice)
      .div(100)
      .toString()

    if (bnum(revenue).isNaN() || !bnum(revenue).isFinite()) {
      return [span, '0']
    }

    return [span, revenue]
  })

  return Object.fromEntries(entries)
}
