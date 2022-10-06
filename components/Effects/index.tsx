import { memo } from 'react'

import BaseEffects from './BaseEffects'
import ConfigEffects from './ConfigEffects'
import ContractEffects from './ContractEffects'
import MediaQueryEffects from './MediaQueryEffects'
import ToastEffects from './ToastEffects'
import TxEffects from './TxEffects'

function Effects() {
  return (
    <>
      <BaseEffects />
      <ConfigEffects />
      <ContractEffects />
      <MediaQueryEffects />
      <ToastEffects />
      <TxEffects />
    </>
  )
}

export default memo(Effects)
