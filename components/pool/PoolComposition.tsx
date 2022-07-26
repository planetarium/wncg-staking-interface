import { memo } from 'react'
import styles from './styles/PoolComposition.module.scss'

function PoolComposition() {
  return (
    <section className={styles.poolComposition}>
      <h3>Pool Composition</h3>
    </section>
  )
}

export default memo(PoolComposition)
