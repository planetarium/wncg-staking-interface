import { memo, useMemo } from 'react'
import NumberFormat from 'react-number-format'
import styles from './styles/PoolComposition.module.scss'

import { gaEvent } from 'lib/gtag'
import { getBalancerPoolUrl, getEtherscanUrl } from 'utils/url'
import { usePool, useFiatCurrency } from 'hooks'

import { Icon } from 'components/Icon'
import { TokenIcon } from 'components/TokenIcon'

function handleGoToBalancer() {
  gaEvent({
    name: `open_balancer_pool`,
  })
}

function createOpenEtherscanHandler(address: string) {
  return function () {
    gaEvent({
      name: 'open_etherscan',
      params: {
        type: 'token',
        address,
      },
    })
  }
}

function PoolComposition() {
  const { toFiat } = useFiatCurrency()
  const { poolId, poolTokens } = usePool()

  const balancerUrl = getBalancerPoolUrl(poolId)
  const openEtherscanHandlers = useMemo(
    () => poolTokens.map((token) => createOpenEtherscanHandler(token.address)),
    [poolTokens]
  )

  return (
    <section className={styles.poolComposition}>
      <header className={styles.header}>
        <h3 className={styles.title}>Pool Composition</h3>
        <a
          className={styles.balancerLink}
          href={balancerUrl}
          onClick={handleGoToBalancer}
          target="_blank"
          rel="noopener"
        >
          Go to Balancer
          <Icon id="arrowRightUp" />
        </a>
      </header>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Token</th>
              <th scope="col">Weight</th>
              <th scope="col">Balance</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            {poolTokens.map((token, i) => {
              const symbol = token.symbol.toLowerCase()
              const usdValue = toFiat(token.address, token.balance)
              const url = getEtherscanUrl(token.address)

              return (
                <tr key={`poolComposition-${token.address}`}>
                  <td>
                    <div className={styles.symbol}>
                      <TokenIcon className={styles.token} symbol={symbol} />
                      <strong>{symbol}</strong>
                      <a
                        className={styles.externalLink}
                        href={url}
                        onClick={openEtherscanHandlers[i]}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Open Etherscan"
                      >
                        <Icon id="arrowRightUp" />
                      </a>
                    </div>
                  </td>
                  <td>{Number(token.weight) * 100}%</td>
                  <td>
                    <NumberFormat
                      value={token.balance}
                      displayType="text"
                      thousandSeparator
                      decimalScale={4}
                    />
                  </td>
                  <td>
                    <NumberFormat
                      value={usdValue}
                      displayType="text"
                      thousandSeparator
                      decimalScale={0}
                      prefix="$"
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default memo(PoolComposition)
