import styles from './style.module.scss'

import { TxAction } from 'services/transaction'

export function getToastAudioFilename(type: ToastType, action?: TxAction) {
  switch (type) {
    case 'success':
      switch (action) {
        case TxAction.ClaimAll:
        case TxAction.ClaimBal:
        case TxAction.ClaimWncg:
        case TxAction.EarmarkRewards:
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
          💥
        </span>
      )
    default:
      return null
  }
}
