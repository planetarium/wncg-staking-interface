import { useMount } from 'react-use'
import { useRecoilValue } from 'recoil'
import clsx from 'clsx'
import styles from './style.module.scss'

import { mutedState } from 'app/states/settings'
import { latestToastIdState } from 'app/states/toast'
import { parseMarkdown } from 'utils/transaction'
import { renderToastEmoji } from './utils'

type CustomToastProps = {
  id: string
  message: string
  title: string
  type?: ToastType
}

export function CustomToast({
  id,
  title,
  message,
  type = 'info',
}: CustomToastProps) {
  const muted = useRecoilValue(mutedState)
  const latestToastId = useRecoilValue(latestToastIdState)

  const audio = new Audio('/alert-default.opus')
  const content = parseMarkdown(message)

  useMount(() => {
    if (!muted) {
      audio.addEventListener('canplaythrough', () => {
        audio.play()
      })
    }
  })

  return (
    <aside
      className={clsx(styles.toast, {
        [styles.latest]: id === latestToastId,
      })}
    >
      <header className={styles.header}>
        <h4 className={styles.title}>
          {renderToastEmoji(type)}
          {title}
        </h4>
      </header>

      <p
        className={styles.desc}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </aside>
  )
}
