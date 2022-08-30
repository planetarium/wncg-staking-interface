import styles from './style.module.scss'

import { TransactionAction } from 'services/transaction'

export function getToastAudioFilename(
  action: TransactionAction,
  type: ToastType
) {
  switch (type) {
    case 'success':
      switch (action) {
        case TransactionAction.ClaimAllRewards:
        case TransactionAction.ClaimBalRewards:
        case TransactionAction.ClaimWncgRewards:
        case TransactionAction.EarmarkRewards:
          return '/alert-money.opus'
        default:
          return '/alert-success.opus'
      }
    default:
      return '/alert-default.opus'
  }
}

export function renderToastEmoji(type: ToastType) {
  switch (type) {
    case 'success':
      return (
        <span className={styles.emoji} aria-hidden>
          🎉
        </span>
      )
    case 'error':
      return (
        <span className={styles.emoji} aria-hidden>
          🚧
        </span>
      )
    default:
      return null
  }
}
