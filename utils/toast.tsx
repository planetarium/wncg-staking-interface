import clsx from 'clsx'
import styles from 'components/Toast/style.module.scss'

export function renderToastBadge(type: ToastType) {
  switch (type) {
    case 'success':
      return (
        <span className={clsx(styles.badge, styles.success)} aria-hidden>
          Success
        </span>
      )
    case 'error':
      return (
        <span className={clsx(styles.badge, styles.fail)} aria-hidden>
          Fail
        </span>
      )
    default:
      return null
  }
}
