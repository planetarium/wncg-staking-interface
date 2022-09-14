/* eslint-disable react/jsx-no-target-blank */
import { useMount } from 'react-use'
import { useRecoilValue } from 'recoil'
import clsx from 'clsx'
import styles from './style.module.scss'

import { mutedState } from 'app/states/settings'
import { latestToastIdState } from 'app/states/toast'
import { parseMarkdown } from 'utils/string'
import { renderToastBadge } from 'utils/toast'
import { getTxUrl } from 'utils/url'

import { Icon } from 'components/Icon'
import { ImportTokens } from './ImportTokens'

type ToastProps = {
  id: string
  message: string
  title: string
  hash?: string
  tokensToImport?: string[]
  type?: ToastType
}

export function Toast({
  id,
  title,
  message,
  hash,
  tokensToImport,
  type = 'info',
}: ToastProps) {
  const muted = useRecoilValue(mutedState)
  const latestToastId = useRecoilValue(latestToastIdState)

  const audio = new Audio('/alert-default.opus')
  const content = parseMarkdown(message)
  const txUrl = getTxUrl(hash)

  function openExplorer() {
    if (!txUrl) return
    window.open(txUrl, '_blank')
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
        {renderToastBadge(type)}
        <h4 className={styles.title}>{title}</h4>
        {txUrl && (
          <a
            className={styles.link}
            href={txUrl}
            target="_blank"
            rel="noopener"
          >
            <Icon id="externalLink" />
          </a>
        )}
      </header>

      <p
        className={styles.desc}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {tokensToImport && (
        <footer className={styles.footer}>
          <ImportTokens id={id} addresses={tokensToImport} />
        </footer>
      )}
    </aside>
  )
}
