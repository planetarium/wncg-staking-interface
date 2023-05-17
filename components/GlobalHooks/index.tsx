import { memo } from 'react'
import dynamic from 'next/dynamic'

import Suspense from 'components/Suspense'
import Web3 from './Web3'

const Contract = dynamic(() => import('./Contract'), {
  suspense: true,
})

const Interface = dynamic(() => import('./Interface'), {
  suspense: true,
})

const Unstake = dynamic(() => import('./Unstake'), {
  suspense: true,
})

function GlobalHooks() {
  return (
    <>
      <Web3 />

      <Suspense>
        <Contract />
      </Suspense>

      <Suspense>
        <Interface />
      </Suspense>

      <Suspense>
        <Unstake />
      </Suspense>
    </>
  )
}

export default memo(GlobalHooks)
