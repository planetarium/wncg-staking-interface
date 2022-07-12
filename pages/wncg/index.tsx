import { useEffect } from 'react'
import { dehydrate, QueryClient, useQuery } from 'react-query'
import { usePrevious } from 'react-use'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useQuery as useGraphqlQuery } from '@apollo/client'
import clsx from 'clsx'
import styles from 'styles/Wncg.module.scss'

import { getShowAlert } from 'app/states/connection'
import { getIsDesktop } from 'app/states/mediaQuery'
import {
  setBalPrice,
  setTotalWethSupply,
  setTotalWncgSupply,
  setWethPrice,
  setWncgPrice,
} from 'app/states/token'
import { coingecko } from 'lib/axios'
import { POOL_TOKEN_BALANCES } from 'lib/graphql'
import { STAKING_SEO } from 'lib/seo'
import { IS_ETHEREUM } from 'utils/env'
import { useAppDispatch, useAppSelector } from 'hooks'

import Effects from 'components/Effects'
import { Content } from 'components/home/Content'
import { Dashboard } from 'components/home/Dashboard'

const WNCG_TOKEN = IS_ETHEREUM ? 'WNCG' : 'WBTC'

type PoolToken = {
  symbol: string
  balance: string
}

const WncgStaking: NextPage = () => {
  const { pathname } = useRouter()

  const isDesktop = useAppSelector(getIsDesktop)
  const dispatch = useAppDispatch()
  const showAlert = useAppSelector(getShowAlert(() => pathname === '/wncg'))

  const { data } = useQuery('tokenPrices', fetchTokenPrices)
  const { data: poolTokens } = useGraphqlQuery(POOL_TOKEN_BALANCES)

  const { bal, weth, wncg } = data
  const {
    bal: prevBal,
    weth: prevWeth,
    wncg: prevWncg,
  } = usePrevious(data) || {}

  const tokens: PoolToken[] = poolTokens?.pool?.tokens || []
  const wethSupply = tokens.find((t) => t.symbol === 'WETH')?.balance || '0'
  const wncgSupply = tokens.find((t) => t.symbol === WNCG_TOKEN)?.balance || '0'
  const prevWethSupply = usePrevious(wethSupply)
  const prevWncgSupply = usePrevious(wncgSupply)

  useEffect(() => {
    if (prevBal !== bal) dispatch(setBalPrice(bal))
  }, [bal, dispatch, prevBal])

  useEffect(() => {
    if (prevWeth !== weth) dispatch(setWethPrice(weth))
  }, [weth, dispatch, prevWeth])

  useEffect(() => {
    if (prevWncg !== wncg) dispatch(setWncgPrice(wncg))
  }, [wncg, dispatch, prevWncg])

  useEffect(() => {
    if (prevWethSupply !== wethSupply) dispatch(setTotalWethSupply(wethSupply))
  }, [dispatch, prevWethSupply, wethSupply])

  useEffect(() => {
    if (prevWncgSupply !== wncgSupply) dispatch(setTotalWncgSupply(wncgSupply))
  }, [dispatch, prevWncgSupply, wncgSupply])

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

function fetchTokenPrices() {
  const bal = coingecko(`/coins/balancer`)
  const weth = coingecko(`/coins/weth`)
  const wncg = coingecko(
    `/coins/${IS_ETHEREUM ? 'wrapped-ncg' : 'wrapped-bitcoin'}`
  )

  return Promise.all([bal, weth, wncg])
    .then(([balRes, wethRes, wncgRes]) => ({
      bal: balRes.data.market_data.current_price.usd,
      weth: wethRes.data.market_data.current_price.usd,
      wncg: wncgRes.data.market_data.current_price.usd,
    }))
    .catch((err) => err)
}

export async function getServerSideProps() {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery('tokenPrices', fetchTokenPrices)
  const dehydratedState = JSON.parse(JSON.stringify(dehydrate(queryClient)))

  return {
    props: {
      dehydratedState,
    },
  }
}
