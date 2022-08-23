import type { NextPage } from 'next'
import Head from 'next/head'
import styles from 'styles/Pool.module.scss'

import PageWrapper from 'components/StakingPageWrapper'
import ExitForm from 'components/pool/ExitForm'
import MyWallet from 'components/pool/MyWallet'
import MyBalance from 'components/pool/MyBalance'

const WncgExitPool: NextPage = () => {
  return (
    <>
      <Head>
        <title>Exit Pool / WNCG Staking</title>
      </Head>

      <PageWrapper>
        <div className={styles.container}>
          <h1 className="hidden">Exit Pool</h1>

          <div className={styles.left}>
            <MyWallet />
          </div>
          <div className={styles.center}>
            <ExitForm />
          </div>
          <div className={styles.right}>
            <MyBalance />
          </div>
        </div>
      </PageWrapper>
    </>
  )
}

export default WncgExitPool
