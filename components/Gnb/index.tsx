import { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './style.module.scss'

import { isMobileAtom } from 'states/ui'
import { useAccount } from 'hooks'

import { GnbAccount } from './Account'
import { GnbConnect } from './Connect'

export function Gnb() {
  const { isConnected } = useAccount()
  const { pathname } = useRouter()
  const isStakingPage =
    pathname === '/wncg' || pathname.startsWith('/wncg/pool')

  const isMobile = useAtomValue(isMobileAtom)

  const logoSize = useMemo(
    () => (isMobile ? { width: 40, height: 24 } : { width: 66, height: 40 }),
    [isMobile]
  )

  const accountElement = isConnected ? <GnbAccount /> : <GnbConnect />

  return (
    <nav className={styles.gnb}>
      <h1 className={styles.logo}>
        <Link href="/wncg">
          <Image
            {...logoSize}
            src="/img-logo.png"
            layout="fill"
            objectFit="cover"
            priority
            alt="Nine Chronicles WNCG Staking"
          />
        </Link>
      </h1>

      {isStakingPage && accountElement}
    </nav>
  )
}
