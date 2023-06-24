import { useAuth } from 'hooks'

import { StyledAddLiquidityFormArrow } from './styled'
import Icon from 'components/Icon'

export default function AddLiquidityFormArrow() {
  const { isConnected } = useAuth()

  return (
    <StyledAddLiquidityFormArrow
      className="dashedArrow"
      aria-hidden
      $disabled={!isConnected}
    >
      <span className="dashed" />
      <Icon icon="chevronDown" $size={24} />
    </StyledAddLiquidityFormArrow>
  )
}
