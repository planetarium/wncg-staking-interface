import clsx from 'clsx'

export function renderToastBadge(type: ToastType) {
  switch (type) {
    case 'success' as ToastType:
      return (
        <span className={clsx('badge', 'success')} aria-hidden>
          Success
        </span>
      )
    case 'error' as ToastType:
      return (
        <span className={clsx('badge', 'fail')} aria-hidden>
          Fail
        </span>
      )
    default:
      return null
  }
}
