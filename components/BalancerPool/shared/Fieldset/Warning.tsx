import config from 'config'
import { ANIMATION_MAP, EXIT_MOTION } from 'config/constants/motions'

import { StyledJoinFormWarning } from './styled'
import Icon from 'components/Icon'

export default function JoinFormWarning() {
  return (
    <StyledJoinFormWarning
      {...EXIT_MOTION}
      variants={ANIMATION_MAP.slideInDown}
    >
      <Icon icon="warning" />
      <p className="desc">
        To ensure a smooth transaction,{' '}
        <strong>at least 0.05 {config.nativeCurrency.symbol}</strong> must be
        left in your wallet to pay for gas fees.
      </p>
    </StyledJoinFormWarning>
  )
}
