/* eslint-disable react/jsx-no-target-blank */
import { useMount } from 'react-use'
import store from 'store'
import styles from './style.module.scss'

import { TransactionAction } from 'app/states/transaction'
import { gaEvent } from 'lib/gtag'
import { renderTxTitle } from 'utils/transaction'
import { getTxUrl } from 'utils/url'
import { STORE_MUTED_KEY } from 'constants/storeKeys'

import { Icon } from 'components/Icon'

type ToastProps = {
  action: TransactionAction
  hash: string
  summary: string
  showPartyEmoji?: boolean
}

export function Toast({
  action,
  hash,
  summary,
  showPartyEmoji = false,
}: ToastProps) {
  const muted = store.get(STORE_MUTED_KEY) || false
  const txUrl = getTxUrl(hash)
  const audioFilename = getAudioFilename(action, showPartyEmoji)
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
          {showPartyEmoji && (
            <span className={styles.emoji} aria-hidden>
              🎉
            </span>
          )}
          <span className={styles.anchor}>{renderTxTitle(action)}</span>
        </h4>

        <span className={styles.link}>
          <Icon id="externalLink" />
        </span>
      </header>

      <p className={styles.desc}>{summary}</p>
    </aside>
  )
}

function getAudioFilename(action: TransactionAction, showPartyEmoji: boolean) {
  if (!showPartyEmoji) {
    return '/alert-default.opus'
  }

  switch (action) {
    case TransactionAction.ClaimAllRewards:
    case TransactionAction.ClaimBalRewards:
    case TransactionAction.ClaimWncgRewards:
    case TransactionAction.EarmarkRewards:
      return '/alert-money.opus'
    default:
      return '/alert-success.opus'
  }
}
