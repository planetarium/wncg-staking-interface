import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import styles from './style.module.scss'

import { PendingTxButton } from './TxButton'
import { PendingTxMenu } from './TxMenu'

export function AccountPendingTx() {
  const [show, setShow] = useState(false)

  function open() {
    setShow(true)
  }

  function close() {
    setShow(false)
  }

  return (
    <div className={styles.pendingTx}>
      <PendingTxButton open={open} />
      <AnimatePresence>
        {show && <PendingTxMenu close={close} />}
      </AnimatePresence>
    </div>
  )
}
