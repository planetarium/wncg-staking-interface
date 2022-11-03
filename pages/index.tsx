import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import styles from 'styles/Home.module.scss'

const Home: NextPage = () => {
  return (
    <main className={styles.main}>
      <Head>
        <title>WNCG Staking</title>
        <meta
          name="description"
          content="Stake Balancer LP token and earn rewards!"
        />
      </Head>

      <div className={styles.container}>
        <h1 className={styles.title}>Staking Nine Chronicles Gold</h1>

        <div className={styles.wrapper}>
          <div className={clsx(styles.cardGroup, styles.ncg)}>
            <h3 className={styles.subtitle}>For NCG</h3>
            <a
              className={clsx(styles.card, styles.monster)}
              href="https://ninechronicles.medium.com/monster-collection-muspelheim-the-realm-of-fire-part-2-b5c36e089b81"
              target="_blank"
              rel="noopener"
            >
              <div className={styles.bg} aria-hidden>
                <Image
                  src="/img-monster-1.png"
                  layout="fill"
                  objectFit="contain"
                  priority
                  alt=""
                />
              </div>
              <strong>Monster Collection in Nine Chronicles game</strong>
            </a>

            <a
              className={clsx(styles.card, styles.pos)}
              href="https://github.com/planetarium/libplanet/tree/pbft"
              target="_blank"
              rel="noopener"
            >
              <div className={styles.bg} aria-hidden>
                <Image
                  src="/img-monster-2.png"
                  layout="fill"
                  objectFit="contain"
                  priority
                  alt=""
                />
              </div>
              <strong>
                Proof of Stake
                <span className={styles.misc}>(in development)</span>
              </strong>
            </a>
          </div>

          <div className={clsx(styles.cardGroup, styles.wncg)}>
            <h3 className={styles.subtitle}>For WNCG in Ethereum</h3>
            <Link className={clsx(styles.card, styles.staking)} href="/wncg">
              <div className={styles.bg} aria-hidden>
                <Image
                  src="/img-bg-human.png"
                  layout="fill"
                  objectFit="contain"
                  priority
                  alt=""
                />
              </div>
              <strong>WNCG Staking</strong>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Home
