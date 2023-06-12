import { memo } from 'react'

import Suspense from 'components/Suspense'
import Web3 from './Web3'
import Contract from './Contract'
import Interface from './Interface'

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

export default memo(GlobalHooks)
