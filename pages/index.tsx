import type { NextPage } from 'next'
import Head from 'next/head'

import { StyledMainPage } from 'styles/pages'
export { getStaticProps } from 'lib/getStaticProps'

import WncgCard from 'components/main/WncgCard'
import NcgCard from 'components/main/NcgCard'

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
