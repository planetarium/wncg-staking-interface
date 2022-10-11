import { memo } from 'react'

import { ModalCategory } from 'states/ui'

import { StyledModalContent } from '../styled'
import SelectRewards from './SelectRewards'
import ModalClose from '../ModalClose'

function ClaimRewardModal() {
  return (
    <StyledModalContent>
      <ModalClose modal={ModalCategory.ClaimReward} />
      <header>
        <h2>Claim rewards</h2>
        <h3>Select the all coins to get Rewards</h3>
        <p>Stake한 번 하면, 나중에 withdraw할 때 cooldown 기간 거쳐야해.</p>
      </header>

      <SelectRewards />
    </StyledModalContent>
  )
}

export default memo(ClaimRewardModal)
