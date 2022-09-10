/* eslint-disable react/jsx-no-target-blank */
import { MouseEvent } from 'react'
import { formatDistanceToNow } from 'date-fns'
import styles from './style.module.scss'

import { txInfoMessage, txToastTitle } from 'utils/transaction'
import { parseTxError } from 'utils/error'
import { getTxUrl } from 'utils/url'
import { useTx } from 'hooks'
import { renderToastEmoji } from 'components/Toast/utils'

import { Icon } from 'components/Icon'

type TxItemProps = {
  transaction: Transaction
}

export function TxItem({ transaction }: TxItemProps) {
  const { txService } = useTx()

  const { action, addedTime, finalizedTime, hash, status, params, error } =
    transaction
  const txUrl = getTxUrl(hash)
  const isFailed = status === 'error'
  const txType = isFailed ? 'error' : 'info'
  const title = txToastTitle(action, txType)
  const message = isFailed
    ? parseTxError(error)!.message
    : txInfoMessage(action, params)
  const timestamp = finalizedTime || addedTime

  function handleDelete(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()

    if (!txService) return
    const hashKey = txService.findHashKey(hash)
    if (!hashKey) return
    txService.removeTx(hashKey)
  }

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
