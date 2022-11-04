import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useAtomValue } from 'jotai'
import clsx from 'clsx'
import styles from '../styles/EstimatedEarn.module.scss'

import { estimationPeriodAtom } from 'states/userSettings'
import { countUpOption, usdCountUpOption } from 'constants/countUp'
import { getTokenSymbol } from 'utils/token'
import { useFiatCurrency, useSettings, useStaking } from 'hooks'
import { useEstimation } from './useEstimation'

import { CountUp } from 'components/CountUp'
import { TokenIcon } from 'components/TokenIcon'

type EstimatedEarnProps = {
  amount?: string
}

function EstimatedEarn({ amount = '' }: EstimatedEarnProps) {
  const [estimation, setEstimation] = useState([0, 0])

  const { calcEstimatedRevenue } = useEstimation()
  const { toFiat } = useFiatCurrency()
  const { updateEstimationPeriod } = useSettings()
  const { rewardTokensList } = useStaking()

  const period = useAtomValue(estimationPeriodAtom)

  const updateEstimation = useCallback(() => {
    const expectedRevenues = calcEstimatedRevenue(amount, period)
    if (expectedRevenues.every((value, i) => value === estimation[i])) return
    setEstimation(expectedRevenues)
  }, [amount, estimation, calcEstimatedRevenue, period])

  const periodClassName = useMemo(
    () =>
      clsx(styles.periods, {
        [styles.day]: period === 'day',
        [styles.week]: period === 'week',
        [styles.month]: period === 'month',
        [styles.year]: period === 'year',
      }),
    [period]
  )

  useEffect(() => {
    updateEstimation()
  }, [updateEstimation])

  return (
    <div className={styles.estimatedEarn}>
      <header className={styles.header}>
        <h2 className={styles.title}>Estimated Earn</h2>

        <div className={periodClassName}>
          <button
            className={styles.day}
            type="button"
            value="day"
            onClick={updateEstimationPeriod}
            aria-label="per day"
          >
            1d
          </button>
          <button
            className={styles.week}
            type="button"
            value="week"
            onClick={updateEstimationPeriod}
            aria-label="per week"
          >
            1w
          </button>
          <button
            className={styles.month}
            type="button"
            value="month"
            onClick={updateEstimationPeriod}
            aria-label="per month"
          >
            1m
          </button>
          <button
            className={styles.year}
            type="button"
            value="year"
            onClick={updateEstimationPeriod}
            aria-label="per year"
          >
            1y
          </button>
        </div>
      </header>

      <p className={styles.desc}>
        Expected rewards in case the current APR persists for the selected time
        period. APR can fluctuate with several factors including staking pool
        size and token price.
      </p>

      <dl className={styles.detail}>
        {rewardTokensList.map((address, i) => {
          const amount = estimation[i]

          return (
            <div key={`estimation.${address}`} className={styles.detailItem}>
              <dt>
                <TokenIcon
                  className={styles.token}
                  symbol={getTokenSymbol(address)}
                />
                <strong>{getTokenSymbol(address)}</strong>
              </dt>
              <dd>
                <CountUp
                  {...countUpOption}
                  end={amount}
                  decimals={8}
                  duration={0.5}
                  showAlways
                />
                <CountUp
                  {...usdCountUpOption}
                  className={styles.usd}
                  end={toFiat(rewardTokensList[i], amount)}
                  isApproximate
                  showAlways
                />
              </dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}

const MemoizedEstimatedEarn = memo(EstimatedEarn)
export { MemoizedEstimatedEarn as EstimatedEarn }
