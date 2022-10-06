import type { MouseEvent } from 'react'
import { formatDistanceToNow } from 'date-fns'
import styles from './style.module.scss'

import { renderToastBadge } from 'utils/toast'
import { getTxUrl } from 'utils/url'
import { useTx } from 'hooks'

import { Icon } from 'components/Icon'

type TxItemProps = {
  transaction: Tx
}

export function TxItem({ transaction }: TxItemProps) {
  const { txService } = useTx()

  const { addedTime, finalizedTime, hash, status, toast } = transaction
  const txUrl = getTxUrl(hash)
  const txType = status === 'error' ? 'error' : 'info'
  const { title, messages } = toast
  const message = messages[txType]
  const timestamp = finalizedTime || addedTime

  function handleDelete(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    if (!txService) return
    txService.removeTx(hash)
  }

  return (
    <li className={styles.txItem}>
      <header>
        <h4>
          <a href={txUrl} target="_blank" rel="noopener">
            {renderToastBadge(txType)}
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
