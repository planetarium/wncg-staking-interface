import type { NextPage } from 'next'
import Head from 'next/head'
import { NextSeo } from 'next-seo'

import { MAIN_SEO } from 'lib/seo'
export { getStaticProps } from 'lib/getStaticProps'

import { StyledMainPage } from 'styles/pages'
import RootFavicon from 'components/RootFavicon'
import WncgCard from 'components/main/WncgCard'
import NcgCard from 'components/main/NcgCard'
import RootHooks from 'components/GlobalHooks/Root'

const Home: NextPage = () => {
  return (
    <main>
      <Head>
        <title>Nine Chronicles Staking</title>
        <meta
          name="description"
          content="Stake Balancer LP token and earn rewards!"
        />
        <NextSeo {...MAIN_SEO} />
        <RootFavicon />
      </Head>

      <StyledMainPage layout>
        <div className="container">
          <ul className="cardList">
            <li className="cardItem">
              <WncgCard />
            </li>

            <li className="cardItem">
              <NcgCard />
            </li>
          </ul>
        </div>
      </StyledMainPage>

      <RootHooks />
    </main>
  )
}

export default Home
