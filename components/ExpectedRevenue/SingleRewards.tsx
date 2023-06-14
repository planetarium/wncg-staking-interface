import { memo, useMemo } from 'react'
import { add, secondsInDay } from 'date-fns'

import { bnum } from 'utils/bnum'
import { format } from 'utils/format'
import { formatISO } from 'utils/formatISO'
import { useFiat, useStaking } from 'hooks'

import { StyledExpectedRevenueSingleRewards } from './styled'
import CountUp from 'components/CountUp'
import NumberFormat from 'components/NumberFormat'
import TokenIcon from 'components/TokenIcon'

type ExpectedRevenueSingleRewardsProps = {
  totalStaked: string
  stakedTokenBalance: string
}

function ExpectedRevenueSingleRewards({
  totalStaked,
  stakedTokenBalance,
}: ExpectedRevenueSingleRewardsProps) {
  const toFiat = useFiat()
  const { rewardEmissionsPerSec, rewardTokenAddresses } = useStaking()

  const emissionPerSec = rewardEmissionsPerSec[0]
  const rewardTokenAddress = rewardTokenAddresses[0]

  const revenueMap = useMemo(() => {
    const share = bnum(stakedTokenBalance).div(totalStaked).toString()
    const emissionPerDay = bnum(emissionPerSec).times(secondsInDay)

    return {
      day: emissionPerDay.times(share).toString(),
      week: emissionPerDay.times(7).times(share).toString(),
      month: emissionPerDay.times(30).times(share).toString(),
      year: emissionPerDay.times(365).times(share).toString(),
    }
  }, [emissionPerSec, stakedTokenBalance, totalStaked])

  return (
    <StyledExpectedRevenueSingleRewards className="revenueList">
      {Object.entries(revenueMap).map(([span, expectedReward]) => {
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
            <dt>In a {span}</dt>
            <dd className="timestamp">
              <time dateTime={formatISO(timestamp)}>
                {format(timestamp, { dateOnly: true })}
              </time>
            </dd>

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
    </StyledExpectedRevenueSingleRewards>
  )
}

export default memo(ExpectedRevenueSingleRewards)
