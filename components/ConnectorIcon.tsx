import { memo } from 'react'
import clsx from 'clsx'

import { StyledConnectorIcon } from './styled'
import CryptoIcon from './CryptoIcon'

export type ConnectorIconType =
  | 'coinbaseWallet'
  | 'metaMask'
  | 'trustWallet'
  | 'walletConnect'

type ConnectorIconProps = {
  icon: ConnectorIconType
  ariaLabel?: string
  ariaHidden?: boolean
  className?: string
  $size?: number
}

function ConnectorIcon({
  icon,
  ariaLabel,
  ariaHidden = true,
  className,
  $size = 24,
}: ConnectorIconProps) {
  return (
    <StyledConnectorIcon
      className={clsx('connectorIcon', className)}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      $size={$size}
    >
      <CryptoIcon icon={icon} />
    </StyledConnectorIcon>
  )
}

export default memo(ConnectorIcon)
