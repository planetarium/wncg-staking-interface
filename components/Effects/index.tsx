import { memo } from 'react'

import ApprovalEffects from './ApprovalEffects'
import BaseEffects from './BaseEffects'
import PoolEffects from './PoolEffects'
import RewardEffects from './RewardEffects'
import StakeEffects from './StakeEffects'
import UnstakeEffects from './UnstakeEffects'

function Effects() {
  return (
    <>
      <ApprovalEffects />
      <BaseEffects />
      <PoolEffects />
      <RewardEffects />
      <StakeEffects />
      <UnstakeEffects />
    </>
  )
}

export default memo(Effects)
