import { memo } from 'react'
import clsx from 'clsx'

import { StyledIcon } from './styled'
import CoinIcon from 'public/icons/ic-coin.svg'

export type IconType =
  | 'allowlist'
  | 'check'
  | 'calendar'
  | 'checkboxOff'
  | 'chevronDown'
  | 'chevronLeft'
  | 'chevronRight'
  | 'chevronUp'
  | 'chevronLine'
  | 'close'
  | 'coin'
  | 'coinStack'
  | 'edit'
  | 'copy'
  | 'discord'
  | 'docs'
  | 'done'
  | 'fail' // 32 only
  | 'github'
  | 'globe'
  | 'hamburger'
  | 'info'
  | 'link'
  | 'lock'
  | 'mail'
  | 'medium'
  | 'mute'
  | 'outlink'
  | 'pause'
  | 'play'
  | 'refreshOn'
  | 'refreshOff'
  | 'secure'
  | 'slideClose'
  | 'telegram'
  | 'time'
  | 'twitter'
  | 'transfer'
  | 'unlock'
  | 'unmute'
  | 'usd'
  | 'user'
  | 'warning'

type IconProps = {
  ariaLabel?: string
  ariaHidden?: boolean
  icon: IconType
  className?: string
  $size?: IconSize
}

function Icon({
  ariaLabel,
  ariaHidden = true,
  icon,
  className,
  $size = 16,
}: IconProps) {
  if (icon === 'coin') {
    return (
      <StyledIcon
        className={clsx('icon', icon, className)}
        as="span"
        aria-label={ariaLabel}
        aria-hidden={ariaHidden}
        $size={$size}
      >
        <CoinIcon />
      </StyledIcon>
    )
  }

  return (
    <StyledIcon
      className={clsx('icon', icon, className)}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      $size={$size}
    >
      <use href={`/icons/sprites.svg#${icon}-${$size}`} />
    </StyledIcon>
  )
}

export default memo(Icon)
