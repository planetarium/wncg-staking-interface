import type { NextPage } from 'next'
import Head from 'next/head'
import styles from 'styles/Pool.module.scss'

import PageWrapper from 'components/StakingPageWrapper'
import MyPoolBalance from 'components/pool/MyPoolBalance'
import PoolComposition from 'components/pool/PoolComposition'
import PoolInvestments from 'components/pool/Investments'
import PoolRecentTrades from 'components/pool/RecentTrades'

const WncgPool: NextPage = () => {
  return (
    <>
      <Head>
        <title>B-50WNCG-50WETH / WNCG Staking</title>
      </Head>

      <PageWrapper>
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
      </PageWrapper>
    </>
  )
}

export default WncgPool
