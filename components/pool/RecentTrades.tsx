import { memo, useState } from 'react'
import NumberFormat from 'react-number-format'
import { useQuery } from 'react-query'
import { formatDistanceToNow } from 'date-fns'
import styles from './styles/RecentTrades.module.scss'

import { fetchPoolRecentSwaps } from 'lib/graphql'
import { getSymbolFromAddress } from 'utils/address'
import { truncateAddress } from 'utils/string'

import { Jazzicon } from 'components/Jazzicon'
import { Icon } from 'components/Icon'
import { TokenIcon } from 'components/TokenIcon'

function PoolRecentTrades() {
  const [skip, setSkip] = useState(0)
  const [swaps, setSwaps] = useState<Swap[]>([])

  useQuery(['recentSwaps', skip], () => fetchPoolRecentSwaps(skip * 5, 5), {
    staleTime: 10 * 1_000,
    keepPreviousData: true,
    onSuccess: (data) => {
      setSwaps((prev) => [...new Set([...prev, ...data])])
    },
  })

  function loadMore() {
    setSkip((prev) => prev + 1)
  }

  return (
    <section className={styles.poolRecentTrades}>
      <h3 className={styles.title}>Recent Trades</h3>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Trader</th>
              <th scope="col">Value</th>
              <th scope="col">Trade details</th>
              <th scope="col">Time</th>
            </tr>
          </thead>
          <tbody>
            {swaps.map((swap) => {
              return (
                <tr key={`poolComposition-${swap.timestamp}`}>
                  <td>
                    <div className={styles.trader}>
                      <Jazzicon
                        className={styles.avatar}
                        address={swap.userAddress.id}
                        diameter={30}
                      />
                      {truncateAddress(swap.userAddress.id)}
                    </div>
                  </td>
                  <td>
                    <NumberFormat
                      value={swap.valueUSD}
                      displayType="text"
                      thousandSeparator
                      decimalScale={0}
                      prefix="$"
                    />
                  </td>
                  <td>
                    <div className={styles.tradeDetail}>
                      <TokenIcon
                        className={styles.token}
                        symbol={getSymbolFromAddress(swap.tokenIn)}
                      />
                      <NumberFormat
                        value={swap.tokenAmountIn}
                        displayType="text"
                        thousandSeparator
                        decimalScale={4}
                      />
                      <Icon id="arrowRight" />
                      <TokenIcon
                        className={styles.token}
                        symbol={getSymbolFromAddress(swap.tokenOut)}
                      />
                      <NumberFormat
                        value={swap.tokenAmountOut}
                        displayType="text"
                        thousandSeparator
                        decimalScale={4}
                      />
                    </div>
                  </td>
                  <td>
                    {formatDistanceToNow(swap.timestamp * 1_000, {
                      addSuffix: true,
                    })}
                  </td>
                </tr>
              )
            })}
            <tr>
              <td
                className={styles.loadMore}
                colSpan={4}
                onClick={loadMore}
                role="button"
              >
                Load more
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default memo(PoolRecentTrades)
