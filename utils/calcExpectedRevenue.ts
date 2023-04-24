import { bnum } from './bnum'

const PERIOD_MAP = {
  day: bnum(1).div(365).toString(),
  week: bnum(1).div(52).toString(),
  month: bnum(1).div(12).toString(),
  year: '1',
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
  lpTokenPrice: string,
  rewardTokenPrice: string
): ExpectedRevenueMap {
  const entries = Object.entries(PERIOD_MAP).map(([span, rate]) => {
    const revenue = bnum(amount)
      .times(apr)
      .times(rate)
      .times(lpTokenPrice)
      .div(rewardTokenPrice)
      .div(100)
      .toString()

    if (bnum(revenue).isNaN() || !bnum(revenue).isFinite()) {
      return [span, '0']
    }

    return [span, revenue]
  })

  return Object.fromEntries(entries)
}
