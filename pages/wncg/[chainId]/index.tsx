import { startTransition } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { useSetAtom } from 'jotai'
import { useMount } from 'react-use'
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

import { chainIdAtom } from 'states/system'

const Dashboard = dynamic(() => import('components/staking/Dashboard'), {
  suspense: true,
})

const WncgStaking: NextPage = () => {
  const router = useRouter()
  const setChainId = useSetAtom(chainIdAtom)

  useMount(() => {
    const pathArr = router.asPath.split('/')
    const chainId = Number(pathArr[pathArr.length - 1])

    if (chainId > 0) {
      startTransition(() => {
        setChainId(chainId as ChainId)
      })
    }
  })

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
