/* eslint-disable react/jsx-no-target-blank */
import { useMount } from 'react-use'
import store from 'store'
import styles from './style.module.scss'

import STORAGE_KEYS from 'constants/storageKeys'
import { TxAction } from 'services/transaction'
import { gaEvent } from 'lib/gtag'
import { getTxUrl } from 'utils/url'
import { getToastAudioFilename, renderToastEmoji } from './utils'

import { Icon } from 'components/Icon'

type ToastProps = {
  title: string
  message: string
  action?: TxAction
  hash?: string
  type?: ToastType
}

export function Toast({
  action,
  title,
  message,
  hash = '',
  type = 'info',
}: ToastProps) {
  const muted = store.get(STORAGE_KEYS.UserSettings.Muted) || false
  const txUrl = getTxUrl(hash)
  const audioFilename = getToastAudioFilename(type, action)
  const audio = new Audio(audioFilename)

  function onClick() {
    if (txUrl) {
      window?.open(txUrl)
      gaEvent({
        name: 'open_tx_etherscan',
        params: {
          tx: hash,
        },
      })
    }
  }

  useMount(() => {
    if (!muted) {
      audio.addEventListener('canplaythrough', () => {
        audio.play()
      })
    }
  })

  return (
    <aside className={styles.toast} onClick={onClick}>
      <header className={styles.header}>
        <h4 className={styles.title}>
          {renderToastEmoji(type)}
          <span className={styles.anchor}>{title}</span>
        </h4>

        {txUrl && (
          <span className={styles.link}>
            <Icon id="externalLink" />
          </span>
        )}
      </header>

      <p className={styles.desc}>{message}</p>
    </aside>
  )
}
