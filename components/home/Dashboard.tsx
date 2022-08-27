import { memo } from 'react'
import clsx from 'clsx'
import styles from './styles/Dashboard.module.scss'

import { ModalCategory } from 'app/states/modal'
import { getEarnedBal, getEarnedWncg } from 'app/states/reward'
import { getTotalStaked } from 'app/states/stake'
import { configService } from 'services/config'
import { gaEvent } from 'lib/gtag'
import {
  countUpOption,
  percentCountUpOption,
  usdCountUpOption,
} from 'utils/countUp'
import { sanitizeNumber } from 'utils/num'
import { useAppSelector, useApr, useModal, useUsd } from 'hooks'

import { Button } from 'components/Button'
import { CountUp } from 'components/CountUp'

function Dashboard() {
  const { balApr, wncgApr } = useApr()
  const { addModal } = useModal()
  const { calculateUsdValue } = useUsd()

  const totalStaked = useAppSelector(getTotalStaked)
  const earnedBal = useAppSelector(getEarnedBal)
  const earnedWncg = useAppSelector(getEarnedWncg)

  const staked = parseFloat(sanitizeNumber(totalStaked))
  const bal = parseFloat(sanitizeNumber(earnedBal))
  const wncg = parseFloat(sanitizeNumber(earnedWncg))

  function handleClaim() {
    gaEvent({
      name: 'open_claim_rewards_modal',
    })
    addModal({
      category: ModalCategory.ClaimReward,
    })
  }

  return (
    <section className={styles.dashboard}>
      <h1 className="hidden">Dashboard</h1>

      <div className={styles.reward}>
        <dl className={styles.detail}>
          <div className={styles.detailItem}>
            <dt>Earned WNCG</dt>
            <dd>
              <CountUp {...countUpOption} end={wncg} />
              <CountUp
                {...usdCountUpOption}
                className={styles.usd}
                end={calculateUsdValue('wncg', wncg)}
                isApproximate
              />
            </dd>
          </div>
          <div className={styles.detailItem}>
            <dt>Earned BAL</dt>
            <dd>
              <CountUp {...countUpOption} end={bal} />
              <CountUp
                {...usdCountUpOption}
                className={styles.usd}
                end={getFiatValue(configService.bal, bal)}
                isApproximate
              />
            </dd>
          </div>
        </dl>
        <Button size="large" onClick={handleClaim} fullWidth>
          Claim rewards
        </Button>
      </div>

      <div className={styles.apr}>
        <dl className={styles.detail}>
          <div className={clsx(styles.detailItem, styles.isBig)}>
            <dt>Total Staked</dt>
            <dd>
              <CountUp {...countUpOption} end={staked} showAlways />
              <CountUp
                {...usdCountUpOption}
                className={styles.usd}
                end={calculateUsdValue('bpt', staked)}
                isApproximate
                showAlways
              />
            </dd>
          </div>
          <div className={styles.detailItem}>
            <dt>WNCG APR</dt>
            <dd>
              <CountUp {...percentCountUpOption} end={wncgApr} showAlways />
            </dd>
          </div>
          <div className={styles.detailItem}>
            <dt>BAL APR</dt>
            <dd>
              <CountUp {...percentCountUpOption} end={balApr} showAlways />
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

const MemoizedDashboard = memo(Dashboard)
export { MemoizedDashboard as Dashboard }
