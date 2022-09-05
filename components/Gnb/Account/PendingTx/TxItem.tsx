/* eslint-disable react/jsx-no-target-blank */
import { MouseEvent, useState } from 'react'
import { useMount } from 'react-use'
import { motion } from 'framer-motion'
import styles from './style.module.scss'

import { txErrorMessage, txInfoMessage, txToastTitle } from 'utils/transaction'
import { getTxUrl } from 'utils/url'
import { useTx } from 'hooks'
import { listItemVariants } from '../constants'

import { Icon } from 'components/Icon'

type TxItemProps = {
  transaction: Transaction
}

export function TxItem({ transaction }: TxItemProps) {
  const { txService } = useTx()
  const [error, setError] = useState<any>(false)

  const { action, finalizedTime, hash, params, status } = transaction
  const txUrl = getTxUrl(hash)

  async function checkTxStatus() {
    if (!txService) return
    if (finalizedTime && status === 'error') {
      setError(true)
      return
    }

    try {
      await txService.getTxReceipt(hash)
    } catch (error) {
      // NOTE: Failed tx
      setError(true)
      const newTx: Transaction = {
        ...transaction,
        status: 'error',
        finalizedTime: Date.now(),
      }

      const hashKey = txService.encodeKey(hash, action)
      txService.updateTx(hashKey, newTx)
    }
  }

  function handleDelete(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()

    if (!txService) return
    const hashKey = txService.encodeKey(hash, action)
    txService.removeTx(hashKey)
  }

  useMount(() => {
    checkTxStatus()
  })

  return (
    <motion.li
      className={styles.txItem}
      key={`txItem.${hash}`}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={listItemVariants}
    >
      <header>
        <h4>
          <a href={txUrl} target="_blank" rel="noopener">
            {!!error && (
              <>
                <span className={styles.emoji}>💥</span>
                <span>Failed:</span>
              </>
            )}
            {txToastTitle(action)}
          </a>
        </h4>
        <a className={styles.link} href={txUrl} target="_blank" rel="noopener">
          <Icon id="externalLink" />
        </a>
      </header>

      <p>
        {error ? txErrorMessage(action, params) : txInfoMessage(action, params)}
      </p>

      <button
        className={styles.deleteButton}
        type="button"
        onClick={handleDelete}
      >
        <Icon id="bin" ariaLabel="Delete this item" />
      </button>
    </motion.li>
  )
}
