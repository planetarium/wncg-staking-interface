import type { NextPage } from 'next'
import Head from 'next/head'
import styles from 'styles/Pool.module.scss'

import { usePool, useTokenPrices } from 'hooks'

import Effects from 'components/Effects'

const WncgPoolWithdraw: NextPage = () => {
  useTokenPrices()
  usePool()

  return (
    <>
      <Head>
        <title>Withdraw / WNCG Staking</title>
      </Head>

      <main className={styles.main}>
        <div className={styles.container}>Withdraw</div>
      </main>

      <Effects />
    </>
  )
}

export default WncgPoolWithdraw
