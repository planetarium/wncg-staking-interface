import { ANIMATION_MAP, EXIT_MOTION } from 'config/constants/motions'
import { useChain } from 'hooks'

import { StyledAddLiquidityFormWarning } from './styled'
import Icon from 'components/Icon'

export default function AddLiquidityFormWarning() {
  const { nativeCurrency } = useChain()
  return (
    <StyledAddLiquidityFormWarning
      {...EXIT_MOTION}
      variants={ANIMATION_MAP.slideInDown}
    >
      <Icon icon="warning" />
      <p className="desc">
        To ensure a smooth transaction,{' '}
        <strong>at least 0.05 {nativeCurrency.symbol}</strong> must be left in
        your wallet to pay for gas fees.
      </p>
    </StyledAddLiquidityFormWarning>
  )
}
