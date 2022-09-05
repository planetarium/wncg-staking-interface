import { memo, useState } from 'react'
import NumberFormat from 'react-number-format'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useRecoilValue } from 'recoil'
import { formatDistanceToNow } from 'date-fns'
import clsx from 'clsx'
import styles from './styles/Investments.module.scss'

import { accountState } from 'app/states/connection'
import { fetchPoolJoinExits, getNextPageParam } from 'lib/graphql'
import { bnum } from 'utils/num'
import { usePool, useFiatCurrency } from 'hooks'

import { Checkbox } from 'components/Checkbox'
import { TokenIcon } from 'components/TokenIcon'

function PoolInvestments() {
  const [showMine, setShowMine] = useState(false)

  const { toFiat } = useFiatCurrency()
  const { poolTokenAddresses, poolTokenSymbols } = usePool()

  const account = useRecoilValue(accountState)
  const showFilter = !!account

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(['investments', showMine, account], fetchPoolJoinExits, {
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

  function toggleShowMine() {
    if (!account) return
    setShowMine((prev) => !prev)
  }

  return (
    <section className={styles.poolInvestments}>
      <header className={styles.header}>
        <h3 className={styles.title}>Investments</h3>
        {showFilter && (
          <div className={styles.checkboxGroup}>
            <Checkbox
              id="showMyInvestments"
              checked={showMine}
              onChange={toggleShowMine}
            />
            <label htmlFor="showMyInvestments">Show my investments</label>
          </div>
        )}
      </header>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Action</th>
              <th>Value</th>
              <th>Tokens</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {data?.pages?.map((investments) =>
              investments.map((investment) => {
                const value = investment.amounts
                  .reduce((total, amount, i) => {
                    const address = poolTokenAddresses[i]
                    return total.plus(toFiat(address, amount))
                  }, bnum(0))
                  .toNumber()

                return (
                  <tr key={investment.timestamp}>
                    <td>{renderType(investment.type)}</td>
                    <td>
                      <NumberFormat
                        value={value}
                        decimalScale={2}
                        thousandSeparator
                        displayType="text"
                        prefix="$"
                      />
                    </td>
                    <td>
                      <div className={styles.investmentDetails}>
                        {renderAmounts(
                          investment.amounts,
                          poolTokenSymbols,
                          investment.tx
                        )}
                      </div>
                    </td>
                    <td>
                      {formatDistanceToNow(investment.timestamp * 1_000, {
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
                  {showMine
                    ? "You haven't made any investments in this pool."
                    : 'No investments'}
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

export default memo(PoolInvestments)

function renderType(type: PoolActionType) {
  if (type === 'Join') {
    return (
      <div className={clsx(styles.type, styles.invest)}>
        <span aria-hidden>+</span>
        Invest
      </div>
    )
  }

  return (
    <div className={clsx(styles.type, styles.withdraw)}>
      <span aria-hidden>-</span>
      Withdraw
    </div>
  )
}

function renderAmounts(
  amounts: string[],
  poolTokenSymbols: string[],
  key: string
) {
  return amounts.map((amount, i) => {
    if (amount === '0') {
      return null
    }
    const symbol = poolTokenSymbols[i]
    const lessThanMinAmount = bnum(amount).lt(0.0001)

    return (
      <div key={`${key}.${symbol}${amount}`} className={styles.detail}>
        <TokenIcon className={styles.token} symbol={symbol} />
        {lessThanMinAmount ? (
          <span title={amount}>&lt; 0.0001</span>
        ) : (
          <NumberFormat
            value={amount}
            decimalScale={4}
            displayType="text"
            thousandSeparator
            title={amount}
          />
        )}
      </div>
    )
  })
}
