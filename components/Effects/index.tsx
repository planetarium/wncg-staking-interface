import { memo } from 'react'

import BaseEffects from './BaseEffects'
import ConfigEffects from './ConfigEffects'
import ContractEffects from './ContractEffects'
import TxEffects from './TxEffects'

function Effects() {
  return (
    <>
      <BaseEffects />
      <ConfigEffects />
      <ContractEffects />
      <TxEffects />
    </>
  )
}

export default memo(Effects)
