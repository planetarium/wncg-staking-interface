import { memo, ReactNode } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import styles from './styles/StakingPageWrapper.module.scss'

import { getShowAlert } from 'app/states/connection'
import { getIsDesktop } from 'app/states/mediaQuery'
import { useAppSelector, usePool, usePoolBalances, useTokenPrices } from 'hooks'

import Effects from 'components/Effects'

type StakingPageWrapperProps = {
  children: ReactNode
  showBg?: boolean
}

function StakingPageWrapper({ children, showBg }: StakingPageWrapperProps) {
  const { pathname } = useRouter()
  usePool()
  usePoolBalances()
  useTokenPrices()

  const isDesktop = useAppSelector(getIsDesktop)
  const showAlert = useAppSelector(getShowAlert(() => pathname === '/wncg'))

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
