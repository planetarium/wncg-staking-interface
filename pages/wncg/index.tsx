import dynamic from 'next/dynamic'
import type { NextPage } from 'next'
import Head from 'next/head'
import { NextSeo } from 'next-seo'

import { STAKING_SEO } from 'lib/seo'
export { getStaticProps } from 'lib/getStaticProps'

import { StyledStakingPage } from 'styles/pages/staking'
import Favicon from 'components/Favicon'
import GlobalFooter from 'components/GlobalFooter'
import GlobalHooks from 'components/GlobalHooks'
import Suspense from 'components/Suspense'
import Stake from 'components/staking/Stake'
import { useLocation } from 'react-use'
import { useEffect } from 'react'
import { ChainId } from 'config/chains'
import { useAtom, useSetAtom } from 'jotai'
import { chainIdAtom } from 'states/system'
import { useRouter } from 'next/router'
import { getQueryString } from 'utils/getQueryString'

const Dashboard = dynamic(() => import('components/staking/Dashboard'), {
  suspense: true,
})

const WncgStaking: NextPage = () => {
  const { query } = useRouter()
  const [chainId, setChainId] = useAtom(chainIdAtom)

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
