import { memo } from 'react'
import clsx from 'clsx'

import { StyledSvgIcon } from './styled'
import type { SvgIconSize } from './styled'

import CoinIcon from 'public/ic-coin.svg'
import WalletConnectIcon from 'public/ic-wallet-connect.svg'

export type SvgIconType =
  | 'approximate'
  | 'balancer'
  | 'check'
  | 'checkboxOff'
  | 'checkboxOn'
  | 'chevronDown'
  | 'chevronRight'
  | 'chevronUp'
  | 'close'
  | 'coin'
  | 'coinbaseWallet'
  | 'copy'
  | 'done'
  | 'discord'
  | 'ether'
  | 'export'
  | 'info'
  | 'link'
  | 'loading'
  | 'lock'
  | 'metaMask'
  | 'radioOff'
  | 'radioOn'
  | 'refresh'
  | 'telegram'
  | 'twitter'
  | 'unlock'
  | 'walletConnect'
  | 'warning'
  | 'wncgDark'
  | 'wncgLight'

type SvgIconProps = {
  ariaLabel?: string
  ariaHidden?: boolean
  icon: SvgIconType
  className?: string
  $size?: SvgIconSize
}

function SvgIcon({
  ariaLabel,
  ariaHidden = true,
  icon,
  className,
  $size = 24,
}: SvgIconProps) {
  if (hasGradient(icon)) {
    return (
      <StyledSvgIcon
        className={clsx('icon', className)}
        as="span"
        aria-label={ariaLabel}
        aria-hidden={ariaHidden}
        $size={$size}
      >
        {renderGradientSvgIcon(icon)}
      </StyledSvgIcon>
    )
  }

  return (
    <StyledSvgIcon
      className={clsx('icon', className)}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      $size={$size}
    >
      <use href={`/new-sprites.svg#${icon}`} />
    </StyledSvgIcon>
  )
}

export default memo(SvgIcon)

const gradientIconList = ['coin', 'walletConnect'] as SvgIconType[]

function hasGradient(icon: SvgIconType) {
  return gradientIconList.includes(icon)
}

function renderGradientSvgIcon(icon: SvgIconType) {
  switch (icon) {
    case 'coin':
      return <CoinIcon />
    case 'walletConnect':
      return <WalletConnectIcon />
    default:
      return null
  }
}
