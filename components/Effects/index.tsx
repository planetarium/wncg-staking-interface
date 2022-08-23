import { memo } from 'react'

import ApprovalEffects from './ApprovalEffects'
import BalanceEffects from './BalanceEffects'
import BaseEffects from './BaseEffects'
import ConfigEffects from './ConfigEffects'
import PoolEffects from './PoolEffects'
import RewardEffects from './RewardEffects'
import StakeEffects from './StakeEffects'
import UnstakeEffects from './UnstakeEffects'

function Effects() {
  return (
    <>
      <ApprovalEffects />
      <BalanceEffects />
      <BaseEffects />
      <ConfigEffects />
      <PoolEffects />
      <RewardEffects />
      <StakeEffects />
      <UnstakeEffects />
    </>
  )
}

export default memo(Effects)
