import { memo } from 'react'
import styles from './styles/MyPoolBalance.module.scss'

import { getIsConnected } from 'app/states/connection'
import { getPoolTokens } from 'app/states/pool'
import { useAppSelector, useConnection } from 'hooks'

import { Button } from 'components/Button'
import { TokenIcon } from 'components/TokenIcon'

function MyPoolBalance() {
  const { connect } = useConnection()

  const tokens = useAppSelector(getPoolTokens)
  const isConnected = useAppSelector(getIsConnected)

  return (
    <section className={styles.myPoolBalance}>
      <h3 className={styles.title}>My Pool Balance</h3>

      <dl className={styles.details}>
        {tokens.map((token) => {
          const symbol = (
            token.symbol === 'WBTC' ? 'WNCG' : token.symbol
          ).toLowerCase() as 'wncg' | 'weth'
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
              <dd></dd>
            </div>
          )
        })}
      </dl>

      <div className={styles.buttonGroup}>
        {isConnected ? (
          <>
            <Button size="large" fullWidth>
              Invest
            </Button>
            <Button variant="secondary" size="large" fullWidth>
              Withdraw
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
