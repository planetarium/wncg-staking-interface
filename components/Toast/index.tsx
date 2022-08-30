/* eslint-disable react/jsx-no-target-blank */
import { useMount } from 'react-use'
import store from 'store'
import styles from './style.module.scss'

import { STORE_MUTED_KEY } from 'constants/storeKeys'
import { TransactionAction } from 'services/transaction'
import { gaEvent } from 'lib/gtag'
import { getTxUrl } from 'utils/url'
import { getToastAudioFilename, renderToastEmoji } from './utils'

import { Icon } from 'components/Icon'

type ToastProps = {
  action: TransactionAction
  hash: string
  title: string
  message: string
  type?: ToastType
}

export function Toast({
  action,
  hash,
  title,
  message,
  type = 'info',
}: ToastProps) {
  const muted = store.get(STORE_MUTED_KEY) || false
  const txUrl = getTxUrl(hash)
  const audioFilename = getToastAudioFilename(action, type)
  const audio = new Audio(audioFilename)

  function onClick() {
    window?.open(txUrl)
    gaEvent({
      name: 'open_tx_etherscan',
      params: {
        tx: hash,
      },
    })
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

        <span className={styles.link}>
          <Icon id="externalLink" />
        </span>
      </header>

      <p className={styles.desc}>{message}</p>
    </aside>
  )
}
