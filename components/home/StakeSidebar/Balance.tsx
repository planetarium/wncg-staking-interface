import { useAtomValue } from 'jotai'
import styles from '../styles/StakeSidebar.module.scss'

import { totalStakedAtom } from 'states/staking'
import { countUpOption, usdCountUpOption } from 'constants/countUp'
import { bnum, sanitizeNumber } from 'utils/num'
import { useBalances, usePool, useStakedBalance, useFiatCurrency } from 'hooks'

import { CountUp } from 'components/CountUp'

export function StakeSidebarBalance() {
  const { bptBalance } = useBalances()
  const { toFiat } = useFiatCurrency()
  const { bptAddress } = usePool()
  const { stakedBalance } = useStakedBalance()

  const totalStaked = useAtomValue(totalStakedAtom)
  const share = bnum(stakedBalance).div(totalStaked).times(100).toNumber()

  const transferable = parseFloat(sanitizeNumber(bptBalance))
  const staked = parseFloat(sanitizeNumber(stakedBalance))
  const total = bnum(transferable).plus(stakedBalance).toNumber()

  return (
    <dl className={styles.detail}>
      <div className={styles.detailItem}>
        <dt>Total</dt>
        <dd>
          <CountUp {...countUpOption} start={0} end={total} duration={0.5} />
          <CountUp
            {...usdCountUpOption}
            end={toFiat(bptAddress, total)}
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
            end={toFiat(bptAddress, staked)}
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
            end={toFiat(bptAddress, transferable)}
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
