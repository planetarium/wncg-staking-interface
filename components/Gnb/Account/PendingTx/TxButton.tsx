import Lottie from 'lottie-react'
import { useAtomValue } from 'jotai'
import clsx from 'clsx'
import styles from './style.module.scss'

import { pendingTxListAtom } from 'states/tx'

import loadingAnimation from 'animations/spinner.json'

import { Icon } from 'components/Icon'

type PendingTxButtonProps = {
  open(): void
}

export function PendingTxButton({ open }: PendingTxButtonProps) {
  const pendingTxList = useAtomValue(pendingTxListAtom)
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
