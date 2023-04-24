import dynamic from 'next/dynamic'
import type { NextPage } from 'next'
import Head from 'next/head'
import { NextSeo } from 'next-seo'

import { STAKING_SEO } from 'lib/seo'
export { getStaticProps } from 'lib/getStaticProps'

import { StyledStakingPage } from 'styles/pages/staking'

import Suspense from 'components/Suspense'
import GlobalFooter from 'components/GlobalFooter'

const Dashboard = dynamic(() => import('components/staking/Dashboard'), {
  suspense: true,
})

const Stake = dynamic(() => import('components/staking/Stake'), {
  ssr: false,
})

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

      <StyledStakingPage layout>
        <div className="container">
          <div className="left">
            <Stake />
          </div>

          <div className="right">
            <Suspense>
              <Dashboard />
            </Suspense>
          </div>
        </div>
      </StyledStakingPage>

      <GlobalFooter />
    </>
  )
}

export default WncgStaking
