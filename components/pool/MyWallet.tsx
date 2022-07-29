import { memo } from 'react'
import styles from './styles/MyWallet.module.scss'

function MyWallet() {
  return (
    <section className={styles.myWallet}>
      <h3 className={styles.title}>Pool tokens in my wallet</h3>
    </section>
  )
}

export default memo(MyWallet)
