import dynamic from 'next/dynamic'

import Suspense from 'components/Suspense'
import Web3 from './Web3'
import Contract from './Contract'

const Interface = dynamic(() => import('./Interface'), {
  ssr: false,
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
    </>
  )
}

export default GlobalHooks
