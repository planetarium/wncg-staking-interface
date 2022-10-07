import { memo } from 'react'
import { NumericFormat } from 'react-number-format'
import { useInfiniteQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import styles from './styles/RecentTrades.module.scss'

import { fetchPoolSwaps, getNextPageParam, itemsPerPage } from 'lib/graphql'
import { gaEvent } from 'lib/gtag'
import { truncateAddress } from 'utils/string'
import { getTokenSymbol } from 'utils/token'
import { getTxUrl } from 'utils/url'

import { Icon } from 'components/Icon'
import { Jazzicon } from 'components/Jazzicon'
import { TokenIcon } from 'components/TokenIcon'

function createOpenEtherscanHandler(address: string) {
  return function () {
    gaEvent({
      name: 'open_etherscan',
      params: {
        type: 'tx',
        dataType: 'swap',
        address,
      },
    })
  }
}

function PoolRecentTrades() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(['recentSwaps'], fetchPoolSwaps, {
      getNextPageParam,
      staleTime: 10 * 1_000,
      keepPreviousData: true,
    })

  function loadMore() {
    if (!hasNextPage || isFetchingNextPage) return
    fetchNextPage()
    const length = ((data?.pages.length || 0) + 1) * itemsPerPage
    gaEvent({
      name: `load_more_swaps`,
      params: {
        length,
      },
    })
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
                  <tr key={`poolComposition.${swap.timestamp}`}>
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
                      <NumericFormat
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
                          symbol={getTokenSymbol(swap.tokenIn)}
                        />
                        <NumericFormat
                          value={swap.tokenAmountIn}
                          displayType="text"
                          thousandSeparator
                          decimalScale={4}
                        />
                        <Icon id="arrowRight" />
                        <TokenIcon
                          className={styles.token}
                          symbol={getTokenSymbol(swap.tokenOut)}
                        />
                        <NumericFormat
                          value={swap.tokenAmountOut}
                          displayType="text"
                          thousandSeparator
                          decimalScale={4}
                        />
                      </div>
                    </td>
                    <td>
                      <div className={styles.datetime}>
                        {formatDistanceToNow(swap.timestamp * 1_000, {
                          addSuffix: true,
                        })}
                        <a
                          href={getTxUrl(swap.tx)}
                          onClick={createOpenEtherscanHandler(swap.tx)}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="See transaction detail in Etherscan"
                        >
                          <Icon id="arrowRightUp" />
                        </a>
                      </div>
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
