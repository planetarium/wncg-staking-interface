import { memo, ReactNode } from 'react'
import { useMount } from 'react-use'
import { useQuery } from '@tanstack/react-query'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import Image from 'next/image'
import clsx from 'clsx'
import styles from './styles/StakingPageWrapper.module.scss'

import { invalidPriceState } from 'app/states/error'
import { isDesktopState } from 'app/states/mediaQuery'
import { fetchCoinmarketCapTokenPrice } from 'lib/coinmarketCap'
import { useAlert } from 'hooks'

import Effects from 'components/Effects'

type StakingPageWrapperProps = {
  children: ReactNode
  showBg?: boolean
}

function StakingPageWrapper({ children, showBg }: StakingPageWrapperProps) {
  const { showAlert } = useAlert()
  const isDesktop = useRecoilValue(isDesktopState)
  const setInvalidPrice = useSetRecoilState(invalidPriceState)

  useQuery(['fallbackTokenPrices'], fetchCoinmarketCapTokenPrice, {
    retry: false,
    staleTime: Infinity,
    keepPreviousData: true,
    placeholderData: {},
    onError() {
      setInvalidPrice(true)
    },
  })

  useMount(() => {
    document.body.scrollTo(0, 0)
  })

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
