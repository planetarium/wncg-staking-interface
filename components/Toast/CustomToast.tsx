import { useMount } from 'react-use'
import store from 'store'
import styles from './style.module.scss'

import STORAGE_KEYS from 'constants/storageKeys'
import { renderToastEmoji } from './utils'

type CustomToastProps = {
  title: string
  message: string
  type?: ToastType
}

export function CustomToast({
  title,
  message,
  type = 'info',
}: CustomToastProps) {
  const muted = store.get(STORAGE_KEYS.UserSettings.Muted) || false
  const audio = new Audio('/alert-default.opus')

  useMount(() => {
    if (!muted) {
      audio.addEventListener('canplaythrough', () => {
        audio.play()
      })
    }
  })

  return (
    <aside className={styles.toast}>
      <header className={styles.header}>
        <h4 className={styles.title}>
          {renderToastEmoji(type)}
          {title}
        </h4>
      </header>

      <p className={styles.desc}>{message}</p>
    </aside>
  )
}
