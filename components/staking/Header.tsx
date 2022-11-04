import { memo } from 'react'
import clsx from 'clsx'

import { StyledStakingHeader } from './styled'

function StakingHeader() {
  return (
    <StyledStakingHeader>
      <h2 className="title">
        STAKE YOUR
        <br />
        LP TOKENS,
        <br />& GET REWARDS!
      </h2>

      <div className="effectGroup" aria-hidden>
        <span className={clsx('effect', 'linear')} />
        <span className={clsx('effect', 'diamondLight')} />
        <span className={clsx('effect', 'diamondDark')} />
      </div>
    </StyledStakingHeader>
  )
}

export default memo(StakingHeader)
