import styles from '../styles/StakeSidebar.module.scss'

import { getStakedBalance, getTotalStaked } from 'app/states/stake'
import { countUpOption, usdCountUpOption } from 'utils/countUp'
import Decimal, { sanitizeNumber } from 'utils/num'
import { useAppSelector, useBalances, usePoolService, useUsd } from 'hooks'

import { CountUp } from 'components/CountUp'

export function StakeSidebarBalance() {
  const { bptBalance } = useBalances()
  const { bptAddress } = usePoolService()
  const { getFiatValue } = useUsd()

  const stakedBalance = useAppSelector(getStakedBalance)
  const totalStaked = useAppSelector(getTotalStaked)

  const share = new Decimal(stakedBalance).div(totalStaked).mul(100).toNumber()

  const transferable = parseFloat(sanitizeNumber(bptBalance))
  const staked = parseFloat(sanitizeNumber(stakedBalance))
  const total = new Decimal(transferable).plus(stakedBalance).toNumber()

  return (
    <dl className={styles.detail}>
      <div className={styles.detailItem}>
        <dt>Total</dt>
        <dd>
          <CountUp {...countUpOption} start={0} end={total} duration={0.5} />
          <CountUp
            {...usdCountUpOption}
            end={getFiatValue(bptAddress, total)}
            isApproximate
          />
        </dd>
      </div>
      <div className={styles.detailItem}>
        <dt>
          Your Stakes
          {renderMedal(share)}
        </dt>
        <dd>
          <CountUp {...countUpOption} start={0} end={staked} duration={0.5} />
          <CountUp
            {...usdCountUpOption}
            end={getFiatValue(bptAddress, staked)}
            isApproximate
          />
        </dd>
      </div>
      <div className={styles.detailItem}>
        <dt>Available</dt>
        <dd>
          <CountUp
            {...countUpOption}
            start={0}
            end={transferable}
            duration={0.5}
          />
          <CountUp
            {...usdCountUpOption}
            end={getFiatValue(bptAddress, transferable)}
            isApproximate
          />
        </dd>
      </div>
    </dl>
  )
}

function renderMedal(share: number) {
  const shareTooltip = (
    <span className={styles.tooltip}>
      <strong>{share.toFixed(2)}%</strong> of total staked ❣️
    </span>
  )

  switch (true) {
    case share >= 10:
      return (
        <div className={styles.medal}>
          🥇
          {shareTooltip}
        </div>
      )
    case share >= 1:
      return (
        <div className={styles.medal}>
          🥈
          {shareTooltip}
        </div>
      )
    case share >= 0.1:
      return (
        <div className={styles.medal}>
          🥉
          {shareTooltip}
        </div>
      )
    default:
      return null
  }
}
