import { memo, useMemo } from 'react'
import NumberFormat from 'react-number-format'
import { useRecoilValue } from 'recoil'
import styles from './styles/MyPoolBalance.module.scss'

import { poolState } from 'app/states/pool'
import { getBptBalance } from 'app/states/balance'
import { getIsConnected } from 'app/states/connection'
import CalculatorService from 'services/calculator'
import Decimal from 'utils/num'
import { useAppSelector, useConnection, useUsd } from 'hooks'

import { Button } from 'components/Button'
import { TokenIcon } from 'components/TokenIcon'

function MyPoolBalance() {
  const { connect } = useConnection()
  const { calculateUsdValue } = useUsd()

  const pool = useRecoilValue(poolState)
  const poolTokens = pool?.tokens || []
  const bptBalance = useAppSelector(getBptBalance)
  const isConnected = useAppSelector(getIsConnected)

  const calculator = useMemo(() => {
    if (!pool) return null
    return new CalculatorService(pool, bptBalance, 'exit')
  }, [bptBalance, pool])

  const propAmounts = calculator?.propAmountsGiven(bptBalance, 0, 'send')
    .receive || ['0', '0']

  return (
    <section className={styles.myPoolBalance}>
      <h3 className={styles.title}>My Pool Balance</h3>

      <dl className={styles.details}>
        {poolTokens.map((token, i) => {
          const symbol = token.symbol.toLowerCase()
          const amount = propAmounts[i]
          const amountUsdValue = calculateUsdValue(symbol, amount)

          const tokenAmount = new Decimal(amount)
          const isAmountLessThanMinAmount =
            !tokenAmount.isZero() && tokenAmount.lt(0.0001)

          return (
            <div
              className={styles.detailItem}
              key={`poolBalance-${token.symbol}`}
            >
              <dt>
                <TokenIcon className={styles.token} symbol={symbol} />
                <div className={styles.symbol}>
                  <strong>
                    {Number(token.weight) * 100}% {token.symbol}
                  </strong>
                  <span>{token.name}</span>
                </div>
              </dt>
              <dd>
                {isConnected ? (
                  <>
                    {isAmountLessThanMinAmount ? (
                      '< 0.0001'
                    ) : (
                      <NumberFormat
                        value={amount}
                        displayType="text"
                        thousandSeparator
                        decimalScale={4}
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
                  </>
                ) : (
                  <>
                    <span>-</span>
                    <span className={styles.usd}>$-</span>
                  </>
                )}
              </dd>
            </div>
          )
        })}
      </dl>

      <div className={styles.buttonGroup}>
        {isConnected ? (
          <>
            <Button href="/wncg/pool/join" size="large" fullWidth>
              Join Pool
            </Button>
            <Button
              href="/wncg/pool/exit"
              variant="secondary"
              size="large"
              fullWidth
            >
              Exit Pool
            </Button>
          </>
        ) : (
          <Button onClick={connect} size="large" fullWidth>
            Connect
          </Button>
        )}
      </div>
    </section>
  )
}

export default memo(MyPoolBalance)
