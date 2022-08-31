import { useMemo } from 'react'
import Lottie from 'lottie-react'
import clsx from 'clsx'
import styles from './style.module.scss'

import { useTransaction } from 'hooks'

import loadingAnimation from 'animations/spinner.json'

import { Icon } from 'components/Icon'

type PendingTxButtonProps = {
  open(): void
}

export function PendingTxButton({ open }: PendingTxButtonProps) {
  const { eventLogService } = useTransaction()

  const pendingTxList = useMemo(
    () => eventLogService?.pendingTxList || [],
    [eventLogService?.pendingTxList]
  )

  const hasPendingTx = !!pendingTxList.length

  return (
    <button
      className={clsx(styles.txButton, { [styles.active]: hasPendingTx })}
      type="button"
      onClick={open}
      aria-label="Open pending transaction menu"
    >
      {hasPendingTx ? (
        <div className={styles.ongoing}>
          <Lottie
            className={styles.lottie}
            animationData={loadingAnimation}
            loop
          />
          <span>{pendingTxList.length}</span>
        </div>
      ) : (
        <Icon id="pulse" />
      )}
    </button>
  )
}
