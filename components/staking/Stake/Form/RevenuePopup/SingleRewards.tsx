import { useMemo } from 'react'
import { add, secondsInDay } from 'date-fns'

import { bnum } from 'utils/bnum'
import { format } from 'utils/format'
import { formatISO } from 'utils/formatISO'
import { getExpectedRevenueSpanLabel } from 'utils/getExpectedRevenueSpanLabel'
import { useFiat, useStaking } from 'hooks'

import { StyledStakeFormRevenuePopupSingleRewards } from './styled'
import CountUp from 'components/CountUp'
import NumberFormat from 'components/NumberFormat'
import Icon from 'components/Icon'
import TokenIcon from 'components/TokenIcon'

type StakeFormRevenuePopupSingleRewardsProps = {
  amount: string
  expectedTotalStaked: string
  className?: string
}

export default function StakeFormRevenuePopupSingleRewards({
  amount,
  expectedTotalStaked,
  className,
}: StakeFormRevenuePopupSingleRewardsProps) {
  const toFiat = useFiat()
  const { rewardEmissionsPerSec, rewardTokenAddresses } = useStaking()

  const rewardTokenAddress = rewardTokenAddresses[0]
  const emissionPerSec = rewardEmissionsPerSec[0]

  const revenueMap = useMemo(() => {
    const share = bnum(amount).div(expectedTotalStaked).toString()
    const emissionPerDay = bnum(emissionPerSec).times(secondsInDay)

    return {
      day: emissionPerDay.times(share).toString(),
      week: emissionPerDay.times(7).times(share).toString(),
      month: emissionPerDay.times(30).times(share).toString(),
      year: emissionPerDay.times(365).times(share).toString(),
    }
  }, [amount, emissionPerSec, expectedTotalStaked])

  return (
    <StyledStakeFormRevenuePopupSingleRewards className={className}>
      <header className="header">
        <Icon icon="time" />
        <h3 className="title">Estimated earnings</h3>
      </header>

      <div className="content">
        <dl className="revenueList">
          {Object.entries(revenueMap).map(([span, expectedReward]) => {
            const title = getExpectedRevenueSpanLabel(span)
            const fiatValue = toFiat(expectedReward, rewardTokenAddress)
            const timestamp =
              add(Date.now(), {
                days: span === 'day' ? 1 : 0,
                weeks: span === 'week' ? 1 : 0,
                months: span === 'month' ? 1 : 0,
                years: span === 'year' ? 1 : 0,
              }).getTime() / 1_000

            return (
              <div className="revenueItem" key={`revenueMap:${span}`}>
                <dt>
                  {title}

                  <time className="timestamp" dateTime={formatISO(timestamp)}>
                    {format(timestamp, { dateOnly: true })}
                  </time>
                </dt>

                <dd className="value">
                  <div className="label">
                    <TokenIcon address={rewardTokenAddress} $size={16} />
                    <CountUp value={expectedReward} />
                  </div>

                  <NumberFormat className="usd" value={fiatValue} type="fiat" />
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </StyledStakeFormRevenuePopupSingleRewards>
  )
}
