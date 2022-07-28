import { memo } from 'react'
import NumberFormat from 'react-number-format'
import { useInfiniteQuery } from 'react-query'
import { formatDistanceToNow } from 'date-fns'
import styles from './styles/RecentTrades.module.scss'

import { fetchPoolRecentSwaps, getNextPageParam } from 'lib/graphql'
import { getSymbolFromAddress } from 'utils/address'
import { truncateAddress } from 'utils/string'

import { Jazzicon } from 'components/Jazzicon'
import { Icon } from 'components/Icon'
import { TokenIcon } from 'components/TokenIcon'

function PoolRecentTrades() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(['recentSwaps'], fetchPoolRecentSwaps, {
      getNextPageParam,
      staleTime: 10 * 1_000,
      keepPreviousData: true,
    })

  function loadMore() {
    if (!hasNextPage || isFetchingNextPage) return
    fetchNextPage()
  }

  const isEmpty = data?.pages[0]?.length === 0
  const isInitialLoad = data == null
  const showLoadMore = !isInitialLoad && !isEmpty && hasNextPage

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
            {data?.pages?.map((swaps) =>
              swaps.map((swap) => {
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
              })
            )}

            {isInitialLoad && (
              <tr>
                <td className={styles.empty} colSpan={4}>
                  Fetching...
                </td>
              </tr>
            )}

            {isEmpty && (
              <tr>
                <td className={styles.empty} colSpan={4}>
                  No swaps in this pool.
                </td>
              </tr>
            )}

            {showLoadMore && (
              <tr>
                <td
                  className={styles.loadMore}
                  colSpan={4}
                  onClick={loadMore}
                  role="button"
                >
                  {isFetchingNextPage ? 'Fetching...' : 'Load More'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default memo(PoolRecentTrades)
