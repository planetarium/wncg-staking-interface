import { memo, MouseEvent } from 'react'

import { useRecoilValue } from 'recoil'
import styles from './styles/MyPoolBalance.module.scss'

import { connectedState } from 'app/states/connection'
import { countUpOption, usdCountUpOption } from 'constants/countUp'
import { gaEvent } from 'lib/gtag'
import {
  useBalances,
  useCalculator,
  useConnection,
  usePool,
  useFiatCurrency,
} from 'hooks'

import { Button } from 'components/Button'
import { CountUp } from 'components/CountUp'
import { TokenIcon } from 'components/TokenIcon'

function MyPoolBalance() {
  const calculator = useCalculator('exit')
  const { connect } = useConnection()
  const { toFiat } = useFiatCurrency()

  const { bptAddress, poolTokens } = usePool()
  const { balanceFor } = useBalances()

  const bptBalance = balanceFor(bptAddress)
  const isConnected = useRecoilValue(connectedState)

  const propAmounts = calculator?.propAmountsGiven(bptBalance, 0, 'send')
    .receive || ['0', '0']

  function handlePoolAction(e: MouseEvent) {
    const { action } = (e.currentTarget as HTMLAnchorElement).dataset
    return function () {
      gaEvent({
        name: `${action}_pool`,
      })
    }
  }

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
                    <CountUp {...countUpOption} end={amount} />
                    <CountUp
                      {...usdCountUpOption}
                      end={fiatValue}
                      isApproximate
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
            <Button
              href="/wncg/pool/join"
              onClick={handlePoolAction}
              dataset={{ action: 'join' }}
              size="large"
              fullWidth
            >
              Join Pool
            </Button>
            <Button
              href="/wncg/pool/exit"
              onClick={handlePoolAction}
              dataset={{ action: 'exit' }}
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
