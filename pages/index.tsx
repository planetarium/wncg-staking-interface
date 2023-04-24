import type { NextPage } from 'next'
import Head from 'next/head'

import { StyledMainPage } from 'styles/pages'
export { getStaticProps } from 'lib/getStaticProps'

import MainWncgCard from 'components/main/WncgCard'

const Home: NextPage = () => {
  return (
    <main>
      <Head>
        <title>WNCG Staking</title>
        <meta
          name="description"
          content="Stake Balancer LP token and earn rewards!"
        />
      </Head>

      <StyledMainPage layout>
        <div className="container">
          <MainWncgCard />
        </div>
      </StyledMainPage>
    </main>
  )
}

export default Home
