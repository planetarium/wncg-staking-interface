import config from 'config'
import { EXIT_MOTION } from 'config/motions'
import { slideInDown } from 'config/motionVariants'

import { StyledJoinFormWarning } from './styled'
import Icon from 'components/Icon'

export default function JoinFormWarning() {
  return (
    <StyledJoinFormWarning {...EXIT_MOTION} variants={slideInDown}>
      <Icon icon="warning" />
      <p className="desc">
        To ensure a smooth transaction,{' '}
        <strong>at least 0.05 {config.nativeCurrency.symbol}</strong> must be
        left in your wallet to pay for gas fees.
      </p>
    </StyledJoinFormWarning>
  )
}
