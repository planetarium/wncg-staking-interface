import type { MouseEvent } from 'react'
import styles from './RewardItem.module.scss'

import { countUpOption, usdCountUpOption } from 'constants/countUp'
import { bnum } from 'utils/num'
import { useAccount } from 'hooks'

import { Button } from 'components/Button'
import { CountUp } from 'components/CountUp'
import { TokenIcon } from 'components/TokenIcon'

type RewardItemProps = {
  amount: string
  fiatValue: number
  handleClaim(e: MouseEvent): void
  loading: string | null
  symbol: string
}

export function RewardItem({
  amount,
  fiatValue,
  handleClaim,
  loading,
  symbol,
}: RewardItemProps) {
  const { isConnected } = useAccount()

  const isLoading = loading === symbol.toLowerCase()
  const disabled =
    !isConnected ||
    bnum(amount).isZero() ||
    [symbol.toLowerCase(), 'all'].includes(loading || '')

  return (
    <div key={`claimRewardModal.${symbol}`} className={styles.detailItem}>
      <dt>
        <TokenIcon className={styles.token} symbol={symbol} />
        <strong className="hidden">{symbol}</strong>
      </dt>
      <dd>
        <CountUp
          {...countUpOption}
          className={styles.reward}
          end={amount}
          decimals={8}
          duration={0.5}
        />
        <CountUp
          {...usdCountUpOption}
          className={styles.usd}
          end={fiatValue}
          isApproximate
        />
      </dd>
      <dd className={styles.isBig}>
        <Button
          variant="secondary"
          size="small"
          name={symbol.toLowerCase()}
          onClick={handleClaim}
          loading={isLoading}
          disabled={disabled}
          fullWidth
        >
          Claim {symbol}
        </Button>
      </dd>
    </div>
  )
}
