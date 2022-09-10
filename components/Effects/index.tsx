import { memo } from 'react'

import ApprovalEffects from './ApprovalEffects'
import BaseEffects from './BaseEffects'
import ConfigEffects from './ConfigEffects'
import PoolEffects from './PoolEffects'
import RewardEffects from './RewardEffects'
import StakeEffects from './StakeEffects'
import TxEffects from './TxEffects'
import UnstakeEffects from './UnstakeEffects'

function Effects() {
  return (
    <>
      <ApprovalEffects />
      <BaseEffects />
      <ConfigEffects />
      <PoolEffects />
      <RewardEffects />
      <StakeEffects />
      <TxEffects />
      <UnstakeEffects />
    </>
  )
}

export default memo(Effects)
