import { useMount } from 'react-use'
import { useRecoilValue } from 'recoil'
import clsx from 'clsx'
import styles from './style.module.scss'

import { mutedState } from 'app/states/settings'
import { latestToastIdState } from 'app/states/toast'
import { parseMarkdown } from 'utils/string'
import { getTxUrl } from 'utils/url'
import { renderToastEmoji } from './utils'

type ToastProps = {
  id: string
  message: string
  title: string
  hash?: string
  type?: ToastType
}

export function Toast({ id, title, message, hash, type = 'info' }: ToastProps) {
  const muted = useRecoilValue(mutedState)
  const latestToastId = useRecoilValue(latestToastIdState)

  const audio = new Audio('/alert-default.opus')
  const content = parseMarkdown(message)
  const txUrl = getTxUrl(hash)

  function openExplorer() {
    if (txUrl) return
    window.open(txUrl)
  }

  const attributes = txUrl
    ? {
        onClick: openExplorer,
        role: 'button',
      }
    : {}

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
      {...attributes}
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
