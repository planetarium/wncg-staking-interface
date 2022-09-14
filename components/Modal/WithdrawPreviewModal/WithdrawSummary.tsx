import styles from './WithdrawSummary.module.scss'

import { countUpOption, usdCountUpOption } from 'constants/countUp'
import { useFiatCurrency, usePool } from 'hooks'

import { CountUp } from 'components/CountUp'
import { TokenIcon } from 'components/TokenIcon'

type WithdrawSummaryProps = {
  amount: string
}

export function WithdrawSummary({ amount }: WithdrawSummaryProps) {
  const { getBptFiatValue } = useFiatCurrency()
  const { poolTokenName, poolTokenSymbols } = usePool()

  return (
    <dl className={styles.withdrawDetail}>
      <dt>
        <div className={styles.tokens} title={poolTokenName}>
          {poolTokenSymbols.map((symbol) => (
            <TokenIcon
              key={`withdrawPreviewToken.${symbol}`}
              className={styles.token}
              symbol={symbol}
            />
          ))}
        </div>
        <CountUp {...countUpOption} decimals={8} end={amount} />
      </dt>

      <dd>
        <CountUp
          {...usdCountUpOption}
          className={styles.usd}
          end={getBptFiatValue(amount)}
          isApproximate
        />
      </dd>
    </dl>
  )
}
