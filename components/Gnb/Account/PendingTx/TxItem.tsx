/* eslint-disable react/jsx-no-target-blank */
import { MouseEvent, useState } from 'react'
import { useMount } from 'react-use'
import { formatDistanceToNow } from 'date-fns'
import styles from './style.module.scss'

import { parseTxError } from 'utils/error'
import { txInfoMessage, txToastTitle } from 'utils/transaction'
import { getTxUrl } from 'utils/url'
import { useTx } from 'hooks'
import { renderToastEmoji } from 'components/Toast/utils'

import { Icon } from 'components/Icon'

type TxItemProps = {
  transaction: Transaction
}

export function TxItem({ transaction }: TxItemProps) {
  const { txService } = useTx()
  const [error, setError] = useState<any>(null)

  const {
    action,
    addedTime,
    finalizedTime,
    hash,
    params,
    status,
    error: storedError,
  } = transaction
  const txUrl = getTxUrl(hash)
  const timestamp = finalizedTime || addedTime

  const txType = error ? 'error' : 'info'
  const title = txToastTitle(action, txType)
  const message = error
    ? parseTxError(error)!.message
    : txInfoMessage(action, params)

  async function checkTxStatus() {
    if (!txService) return
    if (finalizedTime && status === 'error' && !!storedError) {
      setError(storedError)
      return
    }

    try {
      await txService.getTxReceipt(hash)
    } catch (err) {
      // NOTE: Failed tx
      setError(true)
      const newTx: Transaction = {
        ...transaction,
        status: 'error',
        finalizedTime: Date.now(),
        error: err,
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
    <li className={styles.txItem}>
      <header>
        <h4>
          <a href={txUrl} target="_blank" rel="noopener">
            {renderToastEmoji(txType)}
            {title}
          </a>
        </h4>
        <a className={styles.link} href={txUrl} target="_blank" rel="noopener">
          <Icon id="externalLink" />
        </a>
      </header>

      <p>{message}</p>
      <span className={styles.timestamp}>
        {formatDistanceToNow(timestamp, { addSuffix: true })}
      </span>

      <button
        className={styles.deleteButton}
        type="button"
        onClick={handleDelete}
      >
        <Icon id="bin" ariaLabel="Delete this item" />
      </button>
    </li>
  )
}
