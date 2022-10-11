import { memo, ReactNode } from 'react'
import { useMount } from 'react-use'
import { useAtomValue } from 'jotai'
import Image from 'next/image'
import clsx from 'clsx'
import styles from './styles/StakingPageWrapper.module.scss'

import { isDesktopAtom } from 'states/ui'

import Effects from 'components/Effects'

type StakingPageWrapperProps = {
  children: ReactNode
  showBg?: boolean
}

function StakingPageWrapper({ children, showBg }: StakingPageWrapperProps) {
  const isDesktop = useAtomValue(isDesktopAtom)

  useMount(() => {
    document.body.scrollTo(0, 0)
  })

  return (
    <>
      <main className={styles.main}>
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
