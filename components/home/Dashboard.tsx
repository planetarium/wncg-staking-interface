import { memo, MouseEvent } from 'react'
import { useAtomValue } from 'jotai'
import clsx from 'clsx'
import styles from './styles/Dashboard.module.scss'

import { totalStakedAtom } from 'states/staking'
import { ModalCategory } from 'states/ui'
import {
  countUpOption,
  percentCountUpOption,
  usdCountUpOption,
} from 'constants/countUp'
import { gaEvent } from 'lib/gtag'
import { useApr, useModal, useRewards, useFiatCurrency } from 'hooks'

import { Button } from 'components/Button'
import { CountUp } from 'components/CountUp'

function Dashboard() {
  const { aprs } = useApr()
  const { getBptFiatValue } = useFiatCurrency()
  const { addModal } = useModal()
  const { rewards, rewardsInFiatValue, rewardTokenSymbols } = useRewards()

  const totalStaked = useAtomValue(totalStakedAtom)

  function handleClaim(e: MouseEvent) {
    e.stopPropagation()
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
          {rewards.map((reward, i) => {
            const fiatValue = rewardsInFiatValue[i]
            const symbol = rewardTokenSymbols[i]

            return (
              <div key={`reward.${symbol}`} className={styles.detailItem}>
                <dt>Earned {symbol}</dt>
                <dd>
                  <CountUp {...countUpOption} end={reward} />
                  <CountUp
                    {...usdCountUpOption}
                    className={styles.usd}
                    end={fiatValue}
                    isApproximate
                  />
                </dd>
              </div>
            )
          })}
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
              <CountUp {...countUpOption} end={totalStaked} showAlways />
              <CountUp
                {...usdCountUpOption}
                className={styles.usd}
                end={getBptFiatValue(totalStaked)}
                isApproximate
                showAlways
              />
            </dd>
          </div>
          {rewardTokenSymbols.map((symbol, i) => {
            return (
              <div key={`rewardApr.${symbol}`} className={styles.detailItem}>
                <dt>{symbol} APR</dt>
                <dd>
                  <CountUp {...percentCountUpOption} end={aprs[i]} showAlways />
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}

const MemoizedDashboard = memo(Dashboard)
export { MemoizedDashboard as Dashboard }
