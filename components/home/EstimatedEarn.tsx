import {
  memo,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useIsomorphicLayoutEffect } from 'react-use'
import store from 'store'
import clsx from 'clsx'
import styles from './styles/EstimatedEarn.module.scss'

import { configService } from 'services/config'
import { gaEvent } from 'lib/gtag'
import { countUpOption, usdCountUpOption } from 'utils/countUp'
import { STORE_ESTIMATED_EARN_OPTION_KEY } from 'constants/storeKeys'
import { usePoolService, useUsd } from 'hooks'
import { useEstimation } from './useEstimation'

import { CountUp } from 'components/CountUp'
import { TokenIcon } from 'components/TokenIcon'

type EstimatedEarnProps = {
  amount?: string
}

function EstimatedEarn({ amount = '' }: EstimatedEarnProps) {
  const [option, setOption] = useState('year')
  const [wncg, setWncg] = useState(0)
  const [bal, setBal] = useState(0)

  const { getEstimation } = useEstimation()
  const { poolTokenAddresses } = usePoolService()
  const { getFiatValue } = useUsd()

  const updateEstimation = useCallback(() => {
    const { bal: newBal, wncg: newWncg } = getEstimation(amount, option)
    setWncg(newWncg || 0)
    setBal(newBal || 0)
  }, [amount, getEstimation, option])

  function handleOption(e: MouseEvent<HTMLButtonElement>) {
    const newOption = e.currentTarget.value
    setOption(newOption)
    store.set(STORE_ESTIMATED_EARN_OPTION_KEY, newOption)
    gaEvent({
      name: 'estimated_earn_period',
      params: {
        period: newOption,
      },
    })
  }

  const optionsClassName = useMemo(
    () =>
      clsx(styles.options, {
        [styles.day]: option === 'day',
        [styles.week]: option === 'week',
        [styles.month]: option === 'month',
        [styles.year]: option === 'year',
      }),
    [option]
  )

  useIsomorphicLayoutEffect(() => {
    const initialOption = store.get(STORE_ESTIMATED_EARN_OPTION_KEY)
    if (initialOption && initialOption !== option) {
      setOption(initialOption)
    }
  }, [option])

  useEffect(() => {
    updateEstimation()
  }, [updateEstimation])

  return (
    <div className={styles.estimatedEarn}>
      <header className={styles.header}>
        <h2 className={styles.title}>Estimated Earn</h2>

        <div className={optionsClassName}>
          <button
            className={styles.day}
            type="button"
            value="day"
            onClick={handleOption}
            aria-label="per day"
          >
            1d
          </button>
          <button
            className={styles.week}
            type="button"
            value="week"
            onClick={handleOption}
            aria-label="per week"
          >
            1w
          </button>
          <button
            className={styles.month}
            type="button"
            value="month"
            onClick={handleOption}
            aria-label="per month"
          >
            1m
          </button>
          <button
            className={styles.year}
            type="button"
            value="year"
            onClick={handleOption}
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
        <div className={styles.detailItem}>
          <dt>
            <TokenIcon className={styles.token} symbol="wncg" />
            <strong>WNCG</strong>
          </dt>
          <dd>
            <CountUp
              {...countUpOption}
              end={wncg}
              decimals={8}
              duration={0.5}
              showAlways
            />
            <CountUp
              {...usdCountUpOption}
              className={styles.usd}
              end={getFiatValue(poolTokenAddresses[0], wncg)}
              isApproximate
              showAlways
            />
          </dd>
        </div>

        <div className={styles.detailItem}>
          <dt>
            <TokenIcon className={styles.token} symbol="bal" />
            <strong>BAL</strong>
          </dt>
          <dd>
            <CountUp
              {...countUpOption}
              end={bal}
              decimals={8}
              duration={0.5}
              showAlways
            />
            <CountUp
              {...usdCountUpOption}
              className={styles.usd}
              end={getFiatValue(configService.bal, wncg)}
              isApproximate
              showAlways
            />
          </dd>
        </div>
      </dl>
    </div>
  )
}

const MemoizedEstimatedEarn = memo(EstimatedEarn)
export { MemoizedEstimatedEarn as EstimatedEarn }
