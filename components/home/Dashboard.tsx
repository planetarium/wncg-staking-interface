import { memo, MouseEvent } from 'react'
import { useRecoilValue } from 'recoil'
import { isSameAddress } from '@balancer-labs/sdk'
import clsx from 'clsx'
import styles from './styles/Dashboard.module.scss'

import { ModalCategory } from 'app/states/modal'
import { legacyModeState } from 'app/states/settings'
import { configService } from 'services/config'
import { gaEvent } from 'lib/gtag'
import {
  countUpOption,
  percentCountUpOption,
  usdCountUpOption,
} from 'utils/countUp'
import { getTokenSymbol } from 'utils/token'
import {
  useApr,
  useModal,
  useRewards,
  useStaking,
  useFiatCurrency,
} from 'hooks'

import { Button } from 'components/Button'
import { CountUp } from 'components/CountUp'

function Dashboard() {
  const { aprs } = useApr()
  const { getBptFiatValue } = useFiatCurrency()
  const { addModal } = useModal()
  const { rewards, rewardsInFiatValue, rewardTokensList } = useRewards()
  const { totalStaked } = useStaking()

  const legacyMode = useRecoilValue(legacyModeState)

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
            const address = rewardTokensList[i]
            const fiatValue = rewardsInFiatValue[i]
            const symbol = getTokenSymbol(address)

            return (
              <div key={`reward.${address}`} className={styles.detailItem}>
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
          {rewardTokensList.map((address, i) => {
            const symbol = getTokenSymbol(address)

            return (
              <div key={`rewardApr.${address}`} className={styles.detailItem}>
                <dt>{symbol} APR</dt>
                <dd>
                  {legacyMode && isSameAddress(address, configService.bal) ? (
                    'Bootstrapping...'
                  ) : (
                    <CountUp
                      {...percentCountUpOption}
                      end={aprs[i]}
                      showAlways
                    />
                  )}
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
