import styles from './RewardsSummary.module.scss'

import { countUpOption, usdCountUpOption } from 'constants/countUp'
import { getTokenSymbol } from 'utils/token'
import { useRewards } from 'hooks'
import { useStaking } from 'hooks/contracts'

import { CountUp } from 'components/CountUp'
import { TokenIcon } from 'components/TokenIcon'

export function RewardsSummary() {
  const { rewards, rewardsInFiatValue } = useRewards()
  const { rewardTokensList } = useStaking()

  return (
    <dl className={styles.claimDetail}>
      {rewardTokensList.map((address, i) => {
        const symbol = getTokenSymbol(address)
        const amount = rewards[i]
        const fiatValue = rewardsInFiatValue[i]

        return (
          <div key={`withdrawPreview.${address}`} className={styles.detailItem}>
            <dt>
              <TokenIcon className={styles.token} symbol={symbol} />
              <CountUp
                {...countUpOption}
                className={styles.reward}
                end={amount}
                decimals={8}
                duration={0.5}
              />
              <strong className="hidden">{symbol}</strong>
            </dt>
            <dd>
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
  )
}
