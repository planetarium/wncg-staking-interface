import { useState } from 'react'
import type { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import styles from 'styles/form.module.scss'

import { configService } from 'services/config'
import { gaEvent } from 'lib/gtag'

import { Icon } from 'components/Icon'
import PageWrapper from 'components/StakingPageWrapper'
import JoinForm from 'components/pool/JoinForm'
import MyBalance from 'components/pool/MyBalance'
import MyWallet from 'components/pool/MyWallet'

function handleClick() {
  gaEvent({
    name: `go_main`,
    params: {
      from: `join`,
    },
  })
}

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
          <Link href="/wncg">
            <a className={styles.backButton} onClick={handleClick}>
              <Icon id="arrowRight" />
              Go Main
            </a>
          </Link>

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
