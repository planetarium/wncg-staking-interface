import type { NextPage } from 'next'
import Head from 'next/head'
import styles from 'styles/Pool.module.scss'

import { usePool, useTokenPrices } from 'hooks'

import Effects from 'components/Effects'

const WncgPoolInvest: NextPage = () => {
  useTokenPrices()
  usePool()

  return (
    <>
      <Head>
        <title>Invest / WNCG Staking</title>
      </Head>

      <main className={styles.main}>
        <div className={styles.container}>Invest</div>
      </main>

      <Effects />
    </>
  )
}

export default WncgPoolInvest
