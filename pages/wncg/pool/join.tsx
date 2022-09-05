import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from 'styles/form.module.scss'

import { configService } from 'services/config'

import PageWrapper from 'components/StakingPageWrapper'
import JoinForm from 'components/pool/JoinForm'
import MyBalance from 'components/pool/MyBalance'
import MyWallet from 'components/pool/MyWallet'

const WncgJoinPool: NextPage = () => {
  const [currentEther, setCurrentEther] = useState(
    configService.nativeAssetAddress
  )

  function selectEther(value: string) {
    setCurrentEther(value)
  }

  return (
    <>
      <Head>
        <title>Join Pool / WNCG Staking</title>
      </Head>

      <PageWrapper>
        <div className={styles.container}>
          <h1 className="hidden">Join Pool</h1>
          <div className={styles.left}>
            <MyWallet currentEther={currentEther} selectEther={selectEther} />
          </div>
          <div className={styles.center}>
            <JoinForm currentEther={currentEther} selectEther={selectEther} />
          </div>
          <div className={styles.right}>
            <MyBalance />
          </div>
        </div>
      </PageWrapper>
    </>
  )
}

export default WncgJoinPool
