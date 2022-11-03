import { useMemo } from 'react'
import { addDays, addMonths, addWeeks, addYears, format } from 'date-fns'
import clsx from 'clsx'

import { usdCountUpOption } from 'constants/countUp'
import type { EstimatePeriod } from 'constants/time'
import { assertUnreachable } from 'utils/assertion'
import { getTokenColor, getTokenSymbol } from 'utils/token'
import { useFiatCurrency, useRewards } from 'hooks'

import { StyledEarningsEstimateItem } from './styled'
import CountUp from 'new/CountUp'
import TokenIcon from 'new/TokenIcon'

type EarningsEstimateItemProps = {
  period: EstimatePeriod
  className?: string
}

function EarningsEstimateItem({
  period,
  className,
}: EarningsEstimateItemProps) {
  const { toFiat } = useFiatCurrency()
  const { rewardTokensList } = useRewards()

  const today = Date.now()

  const estimations = useMemo(() => ['10', '4.29384'], [])
  const estimationsInFiatValue = useMemo(
    () => estimations.map((amount, i) => toFiat(rewardTokensList[i], amount)),
    [estimations, rewardTokensList, toFiat]
  )

  const targetDate = useMemo(
    () => format(addPeriod(period)(today, 1), 'MMM d, yyyy'),
    [period, today]
  )

  return (
    <StyledEarningsEstimateItem
      className={clsx(`earningsEstimateItem`, className)}
    >
      <div className="date">
        <dt>
          1
          <abbr title={period} aria-label={period}>
            {period[0]}
          </abbr>{' '}
          later
        </dt>
        <dd>{targetDate}</dd>
      </div>

      {rewardTokensList.map((address, i) => {
        const symbol = getTokenSymbol(address)

        return (
          <div
            className="estimate"
            key={`earningsEstimateItem:${period}:${address}`}
          >
            <dt className="hidden">{symbol} rewards</dt>
            <dd className="amount" style={{ color: getTokenColor(address) }}>
              <TokenIcon address={address} $size={14} />
              <CountUp end={estimations[i]} decimals={4} />
            </dd>
            <dd className="usd">
              <CountUp {...usdCountUpOption} end={estimationsInFiatValue[i]} />
            </dd>
          </div>
        )
      })}
    </StyledEarningsEstimateItem>
  )
}

export default EarningsEstimateItem

function addPeriod(period: EstimatePeriod) {
  switch (period) {
    case 'day':
      return addDays
    case 'week':
      return addWeeks
    case 'month':
      return addMonths
    case 'year':
      return addYears
    default:
      assertUnreachable(period)
  }
}
