import type { NextPage } from 'next'
import Head from 'next/head'
import { NextSeo } from 'next-seo'

import { StyledMainPage } from 'styles/pages'
export { getStaticProps } from 'lib/getStaticProps'
import { MAIN_SEO } from 'lib/seo'

import RootFavicon from 'components/RootFavicon'
import WncgCard from 'components/main/WncgCard'
import NcgCard from 'components/main/NcgCard'

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
    </main>
  )
}

export default Home
