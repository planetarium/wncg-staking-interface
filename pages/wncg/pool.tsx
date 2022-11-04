import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'

const Pool = dynamic(() => import('components/Pool'))

const WncgPool: NextPage = () => {
  return (
    <>
      <Head>
        <title>WNCG Staking</title>
      </Head>

      <Pool />
    </>
  )
}

export default WncgPool
