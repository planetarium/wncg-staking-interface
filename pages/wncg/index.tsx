import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import clsx from 'clsx'
import styles from 'styles/Wncg.module.scss'

import { getShowAlert } from 'app/states/connection'
import { getIsDesktop } from 'app/states/mediaQuery'
import { STAKING_SEO } from 'lib/seo'
import { useAppSelector, usePoolBalances, useTokenPrices } from 'hooks'

import Effects from 'components/Effects'
import { Content } from 'components/home/Content'
import { Dashboard } from 'components/home/Dashboard'

const WncgStaking: NextPage = () => {
  const { pathname } = useRouter()
  useTokenPrices()
  usePoolBalances()

  const isDesktop = useAppSelector(getIsDesktop)
  const showAlert = useAppSelector(getShowAlert(() => pathname === '/wncg'))

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

      <main className={clsx(styles.main, { [styles.withAlert]: showAlert })}>
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
      </main>

      {isDesktop && (
        <div className={styles.bgWrapper} aria-hidden>
          <div className={clsx(styles.bg, styles.cash)}>
            <Image src="/img-bg-cash.png" layout="fill" priority alt="" />
          </div>
          <div className={clsx(styles.bg, styles.human)}>
            <Image src="/img-bg-human.png" layout="fill" priority alt="" />
          </div>
        </div>
      )}

      <Effects />
    </>
  )
}

export default WncgStaking
