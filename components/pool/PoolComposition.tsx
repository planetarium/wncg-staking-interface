import { memo } from 'react'
import NumberFormat from 'react-number-format'
import { useRecoilValue } from 'recoil'
import styles from './styles/PoolComposition.module.scss'

import { poolTokensState } from 'app/states/pool'
import { getEtherscanUrl } from 'utils/url'
import { useUsd } from 'hooks'

import { Icon } from 'components/Icon'
import { TokenIcon } from 'components/TokenIcon'

function PoolComposition() {
  const { calculateUsdValue } = useUsd()

  const poolTokens = useRecoilValue(poolTokensState)

  return (
    <section className={styles.poolComposition}>
      <h3 className={styles.title}>Pool Composition</h3>

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
            {poolTokens.map((token) => {
              const symbol = token.symbol.toLowerCase()
              const usdValue = calculateUsdValue(symbol, token.balance)
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
