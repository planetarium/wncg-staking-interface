import { memo } from 'react'

import BaseEffects from './BaseEffects'
import ConfigEffects from './ConfigEffects'
import TxEffects from './TxEffects'

function Effects() {
  return (
    <>
      <BaseEffects />
      <ConfigEffects />
      <TxEffects />
    </>
  )
}

export default memo(Effects)
