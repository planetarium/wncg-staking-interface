import { memo } from 'react'

import BalanceEffects from './BalanceEffects'
import BaseEffects from './BaseEffects'
import ConfigEffects from './ConfigEffects'
import RewardEffects from './RewardEffects'
import StakeEffects from './StakeEffects'
import UnstakeEffects from './UnstakeEffects'

function Effects() {
  return (
    <>
      <BalanceEffects />
      <BaseEffects />
      <ConfigEffects />
      <RewardEffects />
      <StakeEffects />
      <UnstakeEffects />
    </>
  )
}

export default memo(Effects)
