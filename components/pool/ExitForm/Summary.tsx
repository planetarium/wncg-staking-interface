import { memo } from 'react'
import NumberFormat from 'react-number-format'
import clsx from 'clsx'
import styles from '../styles/Form.module.scss'

import { bnum, isLessThanMinAmount } from 'utils/num'
import { getTokenSymbol } from 'utils/token'
import { useFiatCurrency, usePool } from 'hooks'

import { Icon } from 'components/Icon'
import { TokenIcon } from 'components/TokenIcon'

type ExitFormSummaryProps = {
  amountsOut: string[]
  exactOut: boolean
  percentage: number
  priceImpact: number
}

function ExitFormSummary({
  amountsOut,
  exactOut,
  percentage,
  priceImpact,
}: ExitFormSummaryProps) {
  const { toFiat } = useFiatCurrency()
  const { poolTokenAddresses, poolTokenWeights } = usePool()

  const priceImpactPcnt = (priceImpact * 100).toFixed(2)
  const bPriceImpactPcnt = bnum(priceImpactPcnt)

  const lowPriceImpact = !bPriceImpactPcnt.isZero() && bPriceImpactPcnt.lt(0.01)
  const highPriceImpact = bPriceImpactPcnt.gt(1)

  return (
    <dl className={styles.formSummary}>
      {!exactOut &&
        poolTokenAddresses.map((address, i) => {
          const symbol = getTokenSymbol(address)
          let amount = amountsOut[i] || '0'
          amount = bnum(amount).times(percentage).toString()

          const fiatValue = toFiat(address, amount)
          const weight = bnum(poolTokenWeights[i]).times(100).toNumber()

          return (
            <div
              className={styles.detailItem}
              key={`ExitFormSummary.${symbol}`}
            >
              <dt>
                <TokenIcon className={styles.token} symbol={symbol} />
                <strong className={styles.symbol}>
                  {symbol} {weight}%
                </strong>
              </dt>

              <dd>
                {isLessThanMinAmount(amount) ? (
                  <span title={amount}>&lt; 0.0001</span>
                ) : (
                  <NumberFormat
                    value={amount}
                    displayType="text"
                    thousandSeparator
                    decimalScale={4}
                    title={amount}
                  />
                )}
                <NumberFormat
                  className={styles.usd}
                  value={fiatValue}
                  displayType="text"
                  thousandSeparator
                  decimalScale={2}
                  prefix="$"
                />
              </dd>
            </div>
          )
        })}

      <div
        className={clsx(styles.priceImpact, {
          [styles.warning]: highPriceImpact,
        })}
      >
        <dt>Price Impact</dt>
        <dd>
          {lowPriceImpact ? '< 0.01%' : `${priceImpactPcnt}%`}
          {highPriceImpact && <Icon id="alert" ariaHidden />}
        </dd>
      </div>
    </dl>
  )
}

export default memo(ExitFormSummary)
