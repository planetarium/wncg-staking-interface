import { memo } from 'react'

import Suspense from 'components/Suspense'
import BaseEffect from './BaseEffect'
import MediaQueryEffect from './MediaQueryEffect'
import Web3 from './Web3'

function GlobalHooks() {
  return (
    <>
      <Web3 />

      <Suspense>
        <BaseEffect />
      </Suspense>

      <MediaQueryEffect />
    </>
  )
}

export default memo(GlobalHooks)
