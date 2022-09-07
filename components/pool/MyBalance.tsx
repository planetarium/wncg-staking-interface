import { memo, useMemo } from 'react'
import styles from './styles/Widget.module.scss'

import { countUpOption, usdCountUpOption } from 'utils/countUp'
import { bnum, isLessThanMinAmount } from 'utils/num'
import { useBalances, useCalculator, usePool, useFiatCurrency } from 'hooks'

import { CountUp } from 'components/CountUp'

function MyBalance() {
  const { bptBalance } = useBalances()
  const calculator = useCalculator('exit')
  const { toFiat } = useFiatCurrency()
  const { poolTokenAddresses, poolTokens } = usePool()

  const propAmounts = useMemo(
    () =>
      calculator?.propAmountsGiven(bptBalance, 0, 'send').receive || ['0', '0'],
    [bptBalance, calculator]
  )

  const totalFiatValue = useMemo(
    () =>
      propAmounts
        .reduce((total, amount, i) => {
          const address = poolTokenAddresses[i]
          return total.plus(toFiat(address, amount))
        }, bnum(0))
        .toNumber(),
    [toFiat, poolTokenAddresses, propAmounts]
  )

  return (
    <section className={styles.widget}>
      <h3 className={styles.title}>My Pool Balance</h3>
      <dl className={styles.details}>
        {poolTokens.map((token, i) => {
          const symbol = token.symbol.toLowerCase()
          const amount = propAmounts[i]
          const fiatValue = toFiat(token.address, amount)

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
                  <CountUp {...countUpOption} decimals={4} end={amount} />
                )}
                <CountUp {...usdCountUpOption} end={fiatValue} isApproximate />
              </dd>
            </div>
          )
        })}

        <div className={styles.total}>
          <dt>Total</dt>
          <dd>
            <CountUp {...usdCountUpOption} end={totalFiatValue} />
          </dd>
        </div>
      </dl>
    </section>
  )
}

export default memo(MyBalance)
