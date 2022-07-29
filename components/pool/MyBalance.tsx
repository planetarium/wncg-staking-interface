import { memo } from 'react'
import styles from './styles/MyBalance.module.scss'

function MyBalance() {
  return (
    <section className={styles.myBalance}>
      <h3 className={styles.title}>My Pool Balance</h3>
    </section>
  )
}

export default memo(MyBalance)
