import { useRecoilValue } from 'recoil'
import type { NextPage } from 'next'
import Head from 'next/head'
import { NextSeo } from 'next-seo'
import { AnimatePresence } from 'framer-motion'
import styles from 'styles/Wncg.module.scss'

import { legacyModeState } from 'app/states/settings'
import { STAKING_SEO } from 'lib/seo'

import PageWrapper from 'components/StakingPageWrapper'
import { Content } from 'components/home/Content'
import { Dashboard } from 'components/home/Dashboard'
import { HomeHeader } from 'components/home/Header'
import { MigrationNotice } from 'components/home/MigrationNotice'

const WncgStaking: NextPage = () => {
  const legacyMode = useRecoilValue(legacyModeState)
  return (
    <>
      <NextSeo {...STAKING_SEO} />
      <Head>
        <title>WNCG Staking</title>
        <meta
          name="description"
          content="Stake Balancer LP token and earn rewards!"
        />
      </Head>

      <PageWrapper showBg>
        <div className={styles.container}>
          <HomeHeader />
          <AnimatePresence>{legacyMode && <MigrationNotice />}</AnimatePresence>
          <Dashboard />
          <Content />
        </div>
      </PageWrapper>
    </>
  )
}

export default WncgStaking
