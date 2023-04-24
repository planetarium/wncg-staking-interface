import { memo } from 'react'

import Icon from 'components/Icon'

import { StyledCooldownModalPage2Guide } from './styled'

function CooldownModalPage2Guide() {
  return (
    <StyledCooldownModalPage2Guide>
      <div className="guideItem">
        <dt>Rewards will accumulate while being cooled down</dt>
        <dd>
          You still get rewards as long as the tokens stay in the contract.
        </dd>
        <dd className="iconContainer" aria-hidden>
          <Icon icon="coinStack" $size={24} />
        </dd>
      </div>

      <div className="guideItem">
        <dt>There is the withdrawal period</dt>
        <dd>
          You need to withdraw within the 3 days of withdrawal period after the
          cooldown is finished. If you missed the withdrawal period, tokens
          should be cooled down again.
        </dd>
        <dd className="iconContainer" aria-hidden>
          <Icon icon="time" $size={24} />
        </dd>
      </div>
    </StyledCooldownModalPage2Guide>
  )
}

export default memo(CooldownModalPage2Guide)
