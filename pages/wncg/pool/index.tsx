import type { NextPage } from 'next'
import Head from 'next/head'

import Pool from 'new/pool'

const WncgPool: NextPage = () => {
  return (
    <>
      <Head>
        <title>B-50WNCG-50WETH / WNCG Staking</title>
      </Head>

      <Pool />
    </>
  )
}

export default WncgPool
