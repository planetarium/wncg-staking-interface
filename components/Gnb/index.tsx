import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import clsx from 'clsx'
import styles from './style.module.scss'

import { isMobileState } from 'app/states/mediaQuery'
import { useAlert } from 'hooks'

import { GnbAccount } from './Account'
import { GnbConnect } from './Connect'

export function Gnb() {
  const { showAlert } = useAlert()
  const { isConnected } = useAccount()
  const { pathname } = useRouter()
  const isStakingPage =
    pathname === '/wncg' || pathname.startsWith('/wncg/pool')

  const isMobile = useRecoilValue(isMobileState)

  const logoSize = useMemo(
    () => (isMobile ? { width: 40, height: 24 } : { width: 66, height: 40 }),
    [isMobile]
  )

  const accountElement = isConnected ? <GnbAccount /> : <GnbConnect />

  return (
    <nav className={clsx(styles.gnb, { [styles.withAlert]: showAlert })}>
      <h1 className={styles.logo}>
        <Link href="/wncg">
          <a>
            <Image
              {...logoSize}
              src="/img-logo.png"
              layout="fill"
              objectFit="cover"
              priority
              alt="Nine Chronicles WNCG Staking"
            />
          </a>
        </Link>
      </h1>

      {isStakingPage && accountElement}
    </nav>
  )
}
