import { memo, useMemo } from 'react'
import NumberFormat from 'react-number-format'
import styles from './styles/Widget.module.scss'

import { getBalance } from 'app/states/bpt'
import { getPool, getPoolTokens } from 'app/states/pool'
import CalculatorService from 'lib/calculator'
import { useAppSelector, useUsd } from 'hooks'

function MyBalance() {
  const { calculateUsdValue } = useUsd()

  const pool = useAppSelector(getPool)
  const bptBalance = useAppSelector(getBalance)
  const tokens = useAppSelector(getPoolTokens)

  const calculator = useMemo(() => {
    if (!pool) return null
    return new CalculatorService(pool, bptBalance, 'exit')
  }, [bptBalance, pool])

  const propAmounts = useMemo(
    () =>
      calculator?.propAmountsGiven(bptBalance, 0, 'send').receive || ['0', '0'],
    [bptBalance, calculator]
  )

  const totalValue = useMemo(
    () =>
      propAmounts.reduce((acc, amount, i) => {
        const symb = i === 0 ? 'wncg' : 'weth'
        return acc + calculateUsdValue(symb, amount)
      }, 0),
    [calculateUsdValue, propAmounts]
  )

  return (
    <section className={styles.myBalance}>
      <h3 className={styles.title}>My Pool Balance</h3>
      <dl className={styles.details}>
        {tokens.map((token, i) => {
          const symbol = (
            token.symbol === 'WBTC' ? 'WNCG' : token.symbol
          ).toLowerCase() as 'wncg' | 'weth'
          const amount = propAmounts[i]
          const amountUsdValue = calculateUsdValue(symbol, amount)

          return (
            <div
              className={styles.detailItem}
              key={`poolBalance-${token.symbol}`}
            >
              <dt>
                <strong>{symbol}</strong>
                <span>{token.name}</span>
              </dt>
              <dd>
                <NumberFormat
                  value={amount}
                  displayType="text"
                  thousandSeparator
                  decimalScale={4}
                />
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
