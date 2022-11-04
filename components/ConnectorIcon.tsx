import { memo } from 'react'

import { StyledConnectorIcon, SvgIconSize } from './styled'
import SvgIcon from './SvgIcon'

export type ConnectorIconType = 'coinbaseWallet' | 'metaMask' | 'walletConnect'

type ConnectorIconProps = {
  ariaLabel?: string
  ariaHidden?: boolean
  icon: ConnectorIconType
  className?: string
  $size?: SvgIconSize
}

function ConnectorIcon({
  ariaLabel,
  ariaHidden = true,
  icon,
  className,
  $size = 24,
}: ConnectorIconProps) {
  return (
    <StyledConnectorIcon
      className={className}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      $size={$size}
    >
      <SvgIcon icon={icon} />
    </StyledConnectorIcon>
  )
}

export default memo(ConnectorIcon)
