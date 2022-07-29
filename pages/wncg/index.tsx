import type { NextPage } from 'next'
import Head from 'next/head'
import { NextSeo } from 'next-seo'
import styles from 'styles/Wncg.module.scss'

import { STAKING_SEO } from 'lib/seo'

import PageWrapper from 'components/StakingPageWrapper'
import { Content } from 'components/home/Content'
import { Dashboard } from 'components/home/Dashboard'

const WncgStaking: NextPage = () => {
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
          <div className={styles.audit}>
            <p>
              Smart contracts are{' '}
              <a
                href={process.env.NEXT_PUBLIC_AUDIT_REPORT_URL}
                target="_blank"
                rel="noreferrer"
              >
                audited
              </a>{' '}
              by{' '}
              <a
                href="https://blog.theori.io/about"
                target="_blank"
                rel="noreferrer"
              >
                Theori
              </a>
            </p>
          </div>
          <Dashboard />
          <Content />
        </div>
      </PageWrapper>
    </>
  )
}

export default WncgStaking
