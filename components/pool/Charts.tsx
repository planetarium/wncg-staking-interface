import { memo } from 'react'
import styles from './styles/Charts.module.scss'

function PoolCharts() {
  return (
    <section className={styles.poolCharts}>
      <h3 className={styles.title}>Pool Charts</h3>
      <div style={{ height: 200, background: 'blue' }} />
    </section>
  )
}

export default memo(PoolCharts)
