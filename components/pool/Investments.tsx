import { memo, useState } from 'react'
import NumberFormat from 'react-number-format'
import { useInfiniteQuery } from 'react-query'
import { formatDistanceToNow } from 'date-fns'
import clsx from 'clsx'
import styles from './styles/Investments.module.scss'

import { getAccount } from 'app/states/connection'
import { fetchPoolRecentJoinExits } from 'lib/graphql'
import Decimal from 'utils/num'
import { useAppSelector, useUsd } from 'hooks'

import { TokenIcon } from 'components/TokenIcon'
import { Checkbox } from 'components/Checkbox'

function PoolInvestments() {
  const [showMine, setShowMine] = useState(false)

  const { calculateUsdValue } = useUsd()
  const account = useAppSelector(getAccount)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      ['investments', showMine, account],
      fetchPoolRecentJoinExits,
      {
        getNextPageParam: (_, pages) => pages.length * 5,
        staleTime: 10 * 1_000,
        keepPreviousData: true,
      }
    )

  function loadMore() {
    if (!hasNextPage || isFetchingNextPage) return
    fetchNextPage()
  }

  function toggleShowMine() {
    if (!account) return
    setShowMine((prev) => !prev)
  }

  return (
    <section className={styles.poolInvestments}>
      <header className={styles.header}>
        <h3 className={styles.title}>Investments</h3>

        {account && (
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
                const value = investment.amounts.reduce((acc, amount, i) => {
                  const symb = i === 0 ? 'wncg' : 'weth'
                  acc += calculateUsdValue(symb, amount)
                  return acc
                }, 0)

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
                        {renderAmounts(investment.amounts, investment.tx)}
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

            {hasNextPage && (
              <tr>
                <td
                  className={styles.loadMore}
                  colSpan={4}
                  onClick={loadMore}
                  role="button"
                >
                  {isFetchingNextPage ? 'Loading...' : 'Load More'}
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

function renderType(type: InvestType) {
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

function renderAmounts(amounts: string[], key: string) {
  return amounts.map((amount, i) => {
    if (amount === '0') {
      return null
    }

    const symb = i === 0 ? 'wncg' : 'weth'
    const lessThanMinAmount = new Decimal(amount).lt(0.0001)

    return (
      <div key={`${key}.${amount}`} className={styles.detail}>
        <TokenIcon className={styles.token} symbol={symb} />
        {lessThanMinAmount ? (
          '< 0.0001'
        ) : (
          <NumberFormat
            value={amount}
            decimalScale={4}
            displayType="text"
            thousandSeparator
          />
        )}
      </div>
    )
  })
}
