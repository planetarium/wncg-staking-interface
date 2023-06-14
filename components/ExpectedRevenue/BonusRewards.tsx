import { memo, useMemo } from 'react'
import { add } from 'date-fns'

import { calcApr } from 'utils/calcApr'
import {
  calcExpectedRevenue,
  ExpectedRevenueMap,
} from 'utils/calcExpectedRevenue'
import { format } from 'utils/format'
import { formatISO } from 'utils/formatISO'

import { useFiat, useResponsive, useStaking } from 'hooks'

import { StyledExpectedRevenueBonusRewards } from './styled'
import CountUp from 'components/CountUp'
import NumberFormat from 'components/NumberFormat'
import TokenIcon from 'components/TokenIcon'

type ExpectedRevenueBonusRewardsProps = {
  stakedTokenBalance: string
  totalStakedFiatValue: string
}

function ExpectedRevenueBonusRewards({
  stakedTokenBalance,
  totalStakedFiatValue,
}: ExpectedRevenueBonusRewardsProps) {
  const toFiat = useFiat()
  const { isMobile } = useResponsive()
  const { lpToken, rewardEmissionsPerSec, rewardTokenAddresses } = useStaking()

  const aprs = rewardEmissionsPerSec.map(
    (e, i) =>
      calcApr(e, toFiat(1, rewardTokenAddresses[i]), totalStakedFiatValue) ?? 0
  )

  const revenueMapList = useMemo(() => {
    const list = rewardTokenAddresses.map((addr, i) => {
      const tokenPrice = toFiat(1, addr)

      return calcExpectedRevenue(
        stakedTokenBalance,
        aprs[i],
        toFiat(1, lpToken.address) ?? '0',
        tokenPrice
      )
    })

    return Object.keys(list[0]).map((key) => {
      const revenues = list.map((data) => data[key as keyof ExpectedRevenueMap])
      return [key, revenues]
    })
  }, [aprs, lpToken.address, rewardTokenAddresses, stakedTokenBalance, toFiat])

  return (
    <StyledExpectedRevenueBonusRewards className="revenueList">
      {revenueMapList.map(([span, amounts]) => {
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
              In a {span}
              <time dateTime={formatISO(timestamp)}>
                {format(timestamp, { dateOnly: true })}
              </time>
            </dt>

            <dd className="value">
              {(amounts as string[]).map((amt, i) => {
                const addr = rewardTokenAddresses[i]

                return (
                  <div className="valueItem" key={`revenueMap:${span}:${amt}`}>
                    <div className="label">
                      <TokenIcon address={addr} $size={16} />
                      <CountUp value={amt} abbr={isMobile} />
                    </div>

                    <NumberFormat
                      value={toFiat(amt, rewardTokenAddresses[i])}
                      type="fiat"
                      abbr
                    />
                  </div>
                )
              })}
            </dd>
          </div>
        )
      })}
    </StyledExpectedRevenueBonusRewards>
  )
}

export default memo(ExpectedRevenueBonusRewards)
