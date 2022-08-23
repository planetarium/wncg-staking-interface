import { memo } from 'react'
import styles from '../styles/Form.module.scss'

function ExitForm() {
  return (
    <section className={styles.formSection}>
      <h3 className={styles.title}>Withdraw from pool</h3>
    </section>
  )
}

export default memo(ExitForm)
