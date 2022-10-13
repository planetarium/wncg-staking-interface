import type { NextPage } from 'next'
import Head from 'next/head'
import { NextSeo } from 'next-seo'

import { STAKING_SEO } from 'lib/seo'

import { StyledWncgStakingPage } from 'newStyles/styled'
import Dashboard from 'new/staking/Dashboard'
import Form from 'new/staking/Form'
import Header from 'new/staking/Header'

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

      <StyledWncgStakingPage>
        <div className="left">
          <Header />
          <Form />
        </div>
        <div className="right">
          <Dashboard />
        </div>
      </StyledWncgStakingPage>
    </>
  )
}

export default WncgStaking
