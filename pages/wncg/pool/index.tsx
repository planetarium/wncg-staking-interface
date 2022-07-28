import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import clsx from 'clsx'
import styles from 'styles/Pool.module.scss'

import { getIsDesktop } from 'app/states/mediaQuery'
import { useAppSelector } from 'hooks'

import Effects from 'components/Effects'
import MyPoolBalance from 'components/pool/MyPoolBalance'
import PoolComposition from 'components/pool/PoolComposition'
import PoolInvestments from 'components/pool/Investments'
import PoolRecentTrades from 'components/pool/RecentTrades'

const WncgPool: NextPage = () => {
  const isDesktop = useAppSelector(getIsDesktop)

  return (
    <>
      <Head>
        <title>B-50WNCG-50WETH / WNCG Staking</title>
      </Head>

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.right}>
            <MyPoolBalance />
          </div>
          <div className={styles.left}>
            <PoolComposition />
            <PoolInvestments />
            <PoolRecentTrades />
          </div>
        </div>
      </main>

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

      <Effects />
    </>
  )
}

export default WncgPool
