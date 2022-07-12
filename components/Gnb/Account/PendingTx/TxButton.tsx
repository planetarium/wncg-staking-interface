import Lottie from 'lottie-react'
import clsx from 'clsx'
import styles from './style.module.scss'

import { getTxList } from 'app/states/transaction'
import { useAppSelector } from 'hooks'

import loadingAnimation from 'animations/spinner.json'

import { Icon } from 'components/Icon'

type PendingTxButtonProps = {
  open(): void
}

export function PendingTxButton({ open }: PendingTxButtonProps) {
  const txList = useAppSelector(getTxList)
  const hasPendingTx = !!txList.length

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
          <span>{txList.length}</span>
        </div>
      ) : (
        <Icon id="pulse" />
      )}
    </button>
  )
}
