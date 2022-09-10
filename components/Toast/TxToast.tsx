/* eslint-disable react/jsx-no-target-blank */
import { useMount } from 'react-use'
import { useRecoilValue } from 'recoil'
import clsx from 'clsx'
import styles from './style.module.scss'

import { mutedState } from 'app/states/settings'
import { latestToastIdState } from 'app/states/toast'
import { TxAction } from 'services/transaction'
import { gaEvent } from 'lib/gtag'
import { isClaimAction, parseMarkdown } from 'utils/transaction'
import { getTxUrl } from 'utils/url'
import { getToastAudioFilename, renderToastEmoji } from './utils'

import { Icon } from 'components/Icon'
import { ImportTokens } from './ImportTokens'

type TxToastProps = {
  action: TxAction
  id: string
  message: string
  title: string
  hash?: string
  type?: ToastType
}

export function TxToast({
  id,
  action,
  title,
  message,
  hash = '',
  type = 'info',
}: TxToastProps) {
  const muted = useRecoilValue(mutedState)
  const latestToastId = useRecoilValue(latestToastIdState)

  const txUrl = getTxUrl(hash)
  const audioFilename = getToastAudioFilename(type, action)
  const audio = new Audio(audioFilename)
  const content = parseMarkdown(message)

  const showImportTokens = isClaimAction(action) && type === 'success'

  function handleClick() {
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
    <aside
      className={clsx(styles.toast, {
        [styles.latest]: id === latestToastId,
      })}
      onClick={handleClick}
    >
      <header className={styles.header}>
        <h4 className={styles.title}>
          {renderToastEmoji(type)}
          {type === 'error' && 'Failed: '}
          {type === 'success' && 'Completed: '}
          <span className={styles.anchor}>{title}</span>
        </h4>

        {txUrl && (
          <span className={styles.link}>
            <Icon id="externalLink" />
          </span>
        )}
      </header>

      <p
        className={styles.desc}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {showImportTokens && <ImportTokens action={action} hash={hash} />}
    </aside>
  )
}
