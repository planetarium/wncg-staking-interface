import { useMount } from 'react-use'
import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useSetAtom } from 'jotai'
import Head from 'next/head'
import { NextSeo } from 'next-seo'

import { STAKING_SEO } from 'lib/seo'
export { getStaticProps } from 'lib/getStaticProps'
export { getStaticPaths } from 'lib/getStaticPaths'

import { StyledStakingPage } from 'styles/pages/staking'
import Favicon from 'components/Favicon'
import GlobalFooter from 'components/GlobalFooter'
import GlobalHooks from 'components/GlobalHooks'
import Suspense from 'components/Suspense'
import Stake from 'components/staking/Stake'

const Dashboard = dynamic(() => import('components/staking/Dashboard'), {
  suspense: true,
})

type WncgStakingProps = {
  chainId: ChainId
}

const WncgStaking: NextPage<WncgStakingProps> = ({ chainId }) => {
  return (
    <>
      <NextSeo {...STAKING_SEO} />
      <Head>
        <title>WNCG Staking</title>
        <meta
          name="description"
          content="Stake Balancer LP token and earn rewards!"
        />
        <Favicon />
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
      <GlobalHooks />
    </>
  )
}

export default WncgStaking
