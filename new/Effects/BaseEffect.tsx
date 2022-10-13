import { memo } from 'react'
import { useMount } from 'react-use'

import { useTx } from 'hooks'

function BaseEffects() {
  const { txService } = useTx()

  useMount(() => {
    txService?.flushOutdatedTx()
  })

  return null
}

export default memo(BaseEffects)
