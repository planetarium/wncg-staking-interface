import type { NextPage } from 'next'
import Head from 'next/head'
import styles from 'styles/Pool.module.scss'

import PageWrapper from 'components/StakingPageWrapper'

const WncgPoolInvest: NextPage = () => {
  return (
    <>
      <Head>
        <title>Invest / WNCG Staking</title>
      </Head>

      <PageWrapper>
        <div className={styles.container}>Invest</div>
      </PageWrapper>
    </>
  )
}

export default WncgPoolInvest
