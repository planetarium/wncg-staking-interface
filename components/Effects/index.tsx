import { memo } from 'react'
import { BalanceEffects } from './BalanceEffects'
import { BaseEffects } from './BaseEffects'
import { BptEffects } from './BptEffects'
import { RewardEffects } from './RewardEffects'
import { StakeEffects } from './StakeEffects'
import { UnstakeEffects } from './UnstakeEffects'

function Effects() {
  return (
    <>
      <BalanceEffects />
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
