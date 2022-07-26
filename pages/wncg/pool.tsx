import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import clsx from 'clsx'
import styles from 'styles/Pool.module.scss'

import { getIsDesktop } from 'app/states/mediaQuery'
import { getPool } from 'app/states/pool'
import { useAppSelector, usePool } from 'hooks'

const WncgPool: NextPage = () => {
  const pool = useAppSelector(getPool)
  usePool()

  const isDesktop = useAppSelector(getIsDesktop)

  return (
    <>
      <Head>
        <title>WNCG-WETH Pool / WNCG Staking</title>
      </Head>
      {JSON.stringify(pool)}

      <main>main</main>

      {isDesktop && (
        <div className={styles.bgWrapper} aria-hidden>
          <div className={clsx(styles.bg, styles.cash)}>
            <Image src="/img-bg-cash.png" layout="fill" priority alt="" />
          </div>
          <div className={clsx(styles.bg, styles.human)}>
            <Image src="/img-bg-human.png" layout="fill" priority alt="" />
          </div>
        </div>
      )}
    </>
  )
}

export default WncgPool
