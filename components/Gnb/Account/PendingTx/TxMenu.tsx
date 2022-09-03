import { useCallback, useMemo, useRef } from 'react'
import { useMount, useUnmount } from 'react-use'
import { motion } from 'framer-motion'
import styles from './style.module.scss'

import { useTx } from 'hooks'
import { menuTransition, menuVariants } from '../constants'

import { TxItem } from './TxItem'

type PendingTxMenuProps = {
  close(): void
}

export function PendingTxMenu({ close }: PendingTxMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const { txService } = useTx()

  const pendingTxList = useMemo(
    () => txService?.pendingTxList || [],
    [txService?.pendingTxList]
  )

  function clearTransactions() {
    txService?.resetTxMap()
  }

  const closeOnBlur = useCallback(
    (e: MouseEvent) => {
      if (!menuRef?.current?.contains(e.target as Node)) {
        close()
        window.removeEventListener('click', closeOnBlur)
      }
    },
    [close]
  )

  useMount(() => {
    window.addEventListener('click', closeOnBlur, { passive: false })
  })

  useUnmount(() => {
    window.removeEventListener('click', closeOnBlur)
  })

  return (
    <motion.aside
      className={styles.txMenu}
      ref={menuRef}
      key="pendingTxMenu"
      variants={menuVariants}
      transition={menuTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <h1 className={styles.title}>Pending Transactions</h1>

      {!!pendingTxList.length ? (
        <>
          <ul className={styles.txList}>
            {pendingTxList.map((tx) => (
              <TxItem key={tx.hash} transaction={tx} />
            ))}
          </ul>
          <button
            className={styles.clearButton}
            type="button"
            onClick={clearTransactions}
          >
            Clear transactions
          </button>
        </>
      ) : (
        <p className={styles.placeholder}>No pending transactions</p>
      )}
    </motion.aside>
  )
}
