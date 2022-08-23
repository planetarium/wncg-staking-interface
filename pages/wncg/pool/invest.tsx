import { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from 'styles/form.module.scss'

import PageWrapper from 'components/StakingPageWrapper'
import InvestForm from 'components/pool/InvestForm'
import MyBalance from 'components/pool/MyBalance'
import MyWallet from 'components/pool/MyWallet'

const WncgPoolInvest: NextPage = () => {
  const [ethType, setEthType] = useState<EthType>('eth')
  const isNativeAsset = ethType === 'eth'

  function selectEth(value: EthType) {
    setEthType(value)
  }

  return (
    <>
      <Head>
        <title>Invest / WNCG Staking</title>
      </Head>

      <PageWrapper>
        <div className={styles.container}>
          <h1 className="hidden">Invest</h1>

          <div className={styles.left}>
            <MyWallet isNativeAsset={isNativeAsset} selectEth={setEthType} />
          </div>
          <div className={styles.center}>
            <InvestForm isNativeAsset={isNativeAsset} selectEth={selectEth} />
          </div>
          <div className={styles.right}>
            <MyBalance />
          </div>
        </div>
      </PageWrapper>
    </>
  )
}

export default WncgPoolInvest
