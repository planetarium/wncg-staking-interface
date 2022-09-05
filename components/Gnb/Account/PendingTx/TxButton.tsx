import Lottie from 'lottie-react'
import { useRecoilValue } from 'recoil'
import clsx from 'clsx'
import styles from './style.module.scss'

import { pendingTxListState } from 'app/states/transaction'

import loadingAnimation from 'animations/spinner.json'

import { Icon } from 'components/Icon'

type PendingTxButtonProps = {
  open(): void
}

export function PendingTxButton({ open }: PendingTxButtonProps) {
  const pendingTxList = useRecoilValue(pendingTxListState)
  const hasList = !!pendingTxList.length

  return (
    <button
      className={clsx(styles.txButton, { [styles.active]: hasList })}
      type="button"
      onClick={open}
      aria-label="Open pending transaction menu"
    >
      {hasList ? (
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
