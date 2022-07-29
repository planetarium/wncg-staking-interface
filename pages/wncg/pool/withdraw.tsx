import type { NextPage } from 'next'
import Head from 'next/head'
import styles from 'styles/Pool.module.scss'

import PageWrapper from 'components/StakingPageWrapper'

const WncgPoolWithdraw: NextPage = () => {
  return (
    <>
      <Head>
        <title>Withdraw / WNCG Staking</title>
      </Head>

      <PageWrapper>
        <div className={styles.container}>Withdraw</div>
      </PageWrapper>
    </>
  )
}

export default WncgPoolWithdraw
