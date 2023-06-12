import { memo, useMemo } from 'react'
import { add } from 'date-fns'

import { bnum } from 'utils/bnum'
import { calcApr } from 'utils/calcApr'
import {
  calcExpectedRevenue,
  ExpectedRevenueMap,
} from 'utils/calcExpectedRevenue'
import { format } from 'utils/format'
import { formatISO } from 'utils/formatISO'

import { useFiat, useResponsive, useStaking } from 'hooks'
import { useFetchStaking, useFetchUserData } from 'hooks/queries'

import { StyledExpectedRevenue } from './styled'
import CountUp from 'components/CountUp'
import NumberFormat from 'components/NumberFormat'
import TokenIcon from 'components/TokenIcon'

type ExpectedRevenueProps = {
  amount?: string
}

function ExpectedRevenue({ amount = '0' }: ExpectedRevenueProps) {
  const toFiat = useFiat()
  const { isMobile } = useResponsive()
  const { lpToken, rewardEmissionsPerSec, rewardTokenAddresses } = useStaking()

  const { totalStaked = '0' } = useFetchStaking().data ?? {}
  const { stakedTokenBalance = '0' } = useFetchUserData().data ?? {}

  const stakedTokenPrice = toFiat(1, lpToken.address) ?? '0'

  const expectedTotalStakedValue = toFiat(
    bnum(totalStaked).plus(amount).toString(),
    lpToken.address
  )

  const aprs = rewardEmissionsPerSec.map(
    (e, i) =>
      calcApr(
        e,
        toFiat(1, rewardTokenAddresses[i]),
        expectedTotalStakedValue
      ) ?? 0
  )

  const revenueMapList = useMemo(() => {
    const list = rewardTokenAddresses.map((addr, i) => {
      const tokenPrice = toFiat(1, addr)

      return calcExpectedRevenue(
        stakedTokenBalance,
        aprs[i],
        stakedTokenPrice,
        tokenPrice
      )
    })

    return Object.keys(list[0]).map((key) => {
      const revenues = list.map((data) => data[key as keyof ExpectedRevenueMap])
      return [key, revenues]
    })
  }, [aprs, rewardTokenAddresses, stakedTokenBalance, stakedTokenPrice, toFiat])

  return (
    <StyledExpectedRevenue className="revenueList">
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
    </StyledExpectedRevenue>
  )
}

export default memo(ExpectedRevenue)
