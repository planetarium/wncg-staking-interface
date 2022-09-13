import styles from './style.module.scss'

export function getToastAudioFilename(type: ToastType) {
  switch (type) {
    case 'success':
      return '/alert-success.opus'
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
      return (
        <span className={styles.emoji} aria-hidden>
          💫
        </span>
      )
  }
}

export function renderTitlePrefix(type: ToastType) {
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
      return (
        <span className={styles.emoji} aria-hidden>
          💫
        </span>
      )
  }
}
