import type { NextPage } from 'next'
import Head from 'next/head'
import styles from 'styles/Pool.module.scss'

import PageWrapper from 'components/StakingPageWrapper'
import MyWallet from 'components/pool/MyWallet'
import MyBalance from 'components/pool/MyBalance'
import WithdrawForm from 'components/pool/WithdrawForm'

const WncgPoolWithdraw: NextPage = () => {
  return (
    <>
      <Head>
        <title>Withdraw / WNCG Staking</title>
      </Head>

      <PageWrapper>
        <div className={styles.container}>
          <h1 className="hidden">Invest</h1>

          <div className={styles.left}>
            <MyWallet />
          </div>
          <div className={styles.center}>
            <WithdrawForm />
          </div>
          <div className={styles.right}>
            <MyBalance />
          </div>
        </div>
      </PageWrapper>
    </>
  )
}

export default WncgPoolWithdraw