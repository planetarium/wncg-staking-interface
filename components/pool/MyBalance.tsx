import { memo, useMemo } from 'react'
import NumberFormat from 'react-number-format'
import styles from './styles/Widget.module.scss'

import { bnum, isLessThanMinAmount } from 'utils/num'
import { useBalances, useCalculator, usePoolService, useUsd } from 'hooks'

function MyBalance() {
  const { bptBalance } = useBalances()
  const calculator = useCalculator('exit')
  const { poolTokenAddresses, poolTokens } = usePoolService()
  const { getFiatValue } = useUsd()

  const propAmounts = useMemo(
    () =>
      calculator?.propAmountsGiven(bptBalance, 0, 'send').receive || ['0', '0'],
    [bptBalance, calculator]
  )

  const totalValue = useMemo(
    () =>
      propAmounts
        .reduce((total, amount, i) => {
          const address = poolTokenAddresses[i]
          return total.plus(getFiatValue(address, amount))
        }, bnum(0))
        .toNumber(),
    [getFiatValue, poolTokenAddresses, propAmounts]
  )

  return (
    <section className={styles.myBalance}>
      <h3 className={styles.title}>My Pool Balance</h3>
      <dl className={styles.details}>
        {poolTokens.map((token, i) => {
          const symbol = token.symbol.toLowerCase()
          const amount = propAmounts[i]
          const amountUsdValue = getFiatValue(token.address, amount)

          return (
            <div
              className={styles.detailItem}
              key={`poolBalance-${token.symbol}`}
            >
              <dt>
                <strong>{symbol.toUpperCase()}</strong>
                <span>{token.name}</span>
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
                  value={amountUsdValue}
                  displayType="text"
                  thousandSeparator
                  decimalScale={2}
                  prefix="$"
                />
              </dd>
            </div>
          )
        })}

        <div className={styles.total}>
          <dt>Total</dt>
          <dd>
            <NumberFormat
              value={totalValue}
              displayType="text"
              thousandSeparator
              decimalScale={2}
              prefix="$"
            />
          </dd>
        </div>
      </dl>
    </section>
  )
}

export default memo(MyBalance)
