import { memo } from 'react'

import BaseEffect from './BaseEffect'
import ConfigEffect from './ConfigEffect'
import ContractEffect from './ContractEffect'
import MediaQueryEffect from './MediaQueryEffect'
import ToastEffect from './ToastEffect'
import TxEffect from './TxEffect'

function Effects() {
  return (
    <>
      <BaseEffect />
      <ConfigEffect />
      <ContractEffect />
      <MediaQueryEffect />
      <ToastEffect />
      <TxEffect />
    </>
  )
}

export default memo(Effects)
