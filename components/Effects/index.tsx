import { memo } from 'react'
import { BaseEffects } from './BaseEffects'
import { BptEffects } from './BptEffects'
import { RewardEffects } from './RewardEffects'
import { StakeEffects } from './StakeEffects'
import { UnstakeEffects } from './UnstakeEffects'

function Effects() {
  return (
    <>
      <BaseEffects />
      <BptEffects />
      <RewardEffects />
      <StakeEffects />
      <UnstakeEffects />
    </>
  )
}

const MemoizedEffects = memo(Effects)
export default MemoizedEffects
