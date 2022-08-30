import { memo } from 'react'
import NumberFormat from 'react-number-format'
import styles from './styles/MyPoolBalance.module.scss'

import { getIsConnected } from 'app/states/connection'
import { isLessThanMinAmount } from 'utils/num'
import {
  useAppSelector,
  useBalances,
  useCalculator,
  useConnection,
  usePool,
  useFiatCurrency,
} from 'hooks'

import { Button } from 'components/Button'
import { TokenIcon } from 'components/TokenIcon'

function MyPoolBalance() {
  const calculator = useCalculator('exit')
  const { connect } = useConnection()
  const { toFiat } = useFiatCurrency()

  const { bptAddress, poolTokens } = usePool()
  const { balanceFor } = useBalances()

  const bptBalance = balanceFor(bptAddress)
  const isConnected = useAppSelector(getIsConnected)

  const propAmounts = calculator?.propAmountsGiven(bptBalance, 0, 'send')
    .receive || ['0', '0']

  return (
    <section className={styles.myPoolBalance}>
      <h3 className={styles.title}>My Pool Balance</h3>

      <dl className={styles.details}>
        {poolTokens.map((token, i) => {
          const amount = propAmounts[i]
          const fiatValue = toFiat(token.address, amount)

          return (
            <div
              className={styles.detailItem}
              key={`poolBalance-${token.symbol}`}
            >
              <dt>
                <TokenIcon className={styles.token} symbol={token.symbol} />
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
                    {isLessThanMinAmount(amount) ? (
                      <span title={amount}>&lt; 0.0001</span>
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
                      value={fiatValue}
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
