import { memo } from 'react'
import styles from '../styles/Form.module.scss'

function PoolInvestForm() {
  return (
    <section className={styles.formSection}>
      <h3 className={styles.title}>Invest in pool</h3>
      <form>PoolInvestForm</form>
    </section>
  )
}

export default memo(PoolInvestForm)
