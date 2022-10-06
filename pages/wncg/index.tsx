import { useState } from 'react'
import { useAtomValue } from 'jotai'
import type { NextPage } from 'next'
import Head from 'next/head'
import { NextSeo } from 'next-seo'
import { AnimatePresence } from 'framer-motion'
import styles from 'styles/Wncg.module.scss'

import { legacyModeAtom } from 'states/userSettings'
import { STAKING_SEO } from 'lib/seo'

import PageWrapper from 'components/StakingPageWrapper'
import { Content } from 'components/home/Content'
import { Dashboard } from 'components/home/Dashboard'
import { HomeHeader } from 'components/home/Header'
import { MigrationNotice } from 'components/home/MigrationNotice'
import { MigrationModal } from 'components/home/MigrationModal'

const WncgStaking: NextPage = () => {
  const [showModal, setShowModal] = useState(false)
  const legacyMode = useAtomValue(legacyModeAtom)

  function open() {
    setShowModal(true)
  }

  function close() {
    setShowModal(false)
  }

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
          <AnimatePresence>
            {legacyMode && <MigrationNotice open={open} />}
          </AnimatePresence>
          <Dashboard />
          <Content />
        </div>
      </PageWrapper>

      {legacyMode && <MigrationModal close={close} showModal={showModal} />}
    </>
  )
}

export default WncgStaking
