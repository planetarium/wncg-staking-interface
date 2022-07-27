import { memo, useState } from 'react'
import { useQuery } from 'react-query'
import styles from './styles/RecentTrades.module.scss'

import { fetchPoolRecentSwaps } from 'lib/graphql'

function PoolRecentTrades() {
  const [skip, setSkip] = useState(0)
  const [swaps, setSwaps] = useState<Swap[]>([])

  useQuery(['recentSwaps', skip], () => fetchPoolRecentSwaps(skip * 5, 5), {
    staleTime: 10 * 1_000,
    keepPreviousData: true,
    onSuccess: (data) => {
      setSwaps((prev) => [...prev, ...data])
    },
  })

  function loadMore() {
    setSkip((prev) => prev + 1)
  }

  return (
    <section className={styles.poolRecentTrades}>
      <h3>Recent Trades</h3>
      <div>{JSON.stringify(swaps)}</div>
      <button type="button" onClick={loadMore}>
        Load More
      </button>
    </section>
  )
}

export default memo(PoolRecentTrades)
