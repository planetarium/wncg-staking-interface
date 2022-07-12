import { useMount } from 'react-use'
import store from 'store'
import styles from './style.module.scss'

import { STORE_MUTED_KEY } from 'components/Gnb/Account/constants'

type CustomToastProps = {
  title: string
  description: string
}

export function CustomToast({ title, description }: CustomToastProps) {
  const muted = store.get(STORE_MUTED_KEY) || false
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
        <h4 className={styles.title}>{title}</h4>
      </header>
      <p className={styles.desc}>{description}</p>
    </aside>
  )
}
