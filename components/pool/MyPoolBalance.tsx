import { memo } from 'react'
import styles from './styles/MyPoolBalance.module.scss'

function MyPoolBalance() {
  return (
    <section className={styles.myPoolBalance}>
      <h3>My Pool Balance</h3>
    </section>
  )
}

export default memo(MyPoolBalance)
