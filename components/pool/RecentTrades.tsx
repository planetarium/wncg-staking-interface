import { memo } from 'react'
import styles from './styles/RecentTrades.module.scss'

function PoolRecentTrades() {
  return (
    <section className={styles.poolRecentTrades}>
      <h3>Recent Trades</h3>
    </section>
  )
}

export default memo(PoolRecentTrades)
