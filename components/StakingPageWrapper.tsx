import { memo, ReactNode } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import styles from './styles/StakingPageWrapper.module.scss'

import { getIsDesktop } from 'app/states/mediaQuery'
import { useAlert, useAppSelector, useFetchPool } from 'hooks'

import Effects from 'components/Effects'

type StakingPageWrapperProps = {
  children: ReactNode
  showBg?: boolean
}

function StakingPageWrapper({ children, showBg }: StakingPageWrapperProps) {
  const { showAlert } = useAlert()
  useFetchPool()

  const isDesktop = useAppSelector(getIsDesktop)

  return (
    <>
      <main className={clsx(styles.main, { [styles.withAlert]: showAlert })}>
        {children}

        {showBg && isDesktop && (
          <div className={styles.bgWrapper} aria-hidden>
            <div className={clsx(styles.bg, styles.cash)}>
              <Image src="/img-bg-cash.png" layout="fill" priority alt="" />
            </div>
            <div className={clsx(styles.bg, styles.human)}>
              <Image src="/img-bg-human.png" layout="fill" priority alt="" />
            </div>
          </div>
        )}
      </main>

      <Effects />
    </>
  )
}

export default memo(StakingPageWrapper)
