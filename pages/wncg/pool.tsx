import type { NextPage } from 'next'
import Head from 'next/head'

import { getPool } from 'app/states/pool'
import { useAppSelector, usePool } from 'hooks'

const WncgPool: NextPage = () => {
  const pool = useAppSelector(getPool)
  usePool()

  return (
    <>
      <Head>
        <title>WNCG-WETH Pool / WNCG Staking</title>
      </Head>
      {JSON.stringify(pool)}

      <main>main</main>
    </>
  )
}

export default WncgPool
