import { memo } from 'react'
import styled from 'styled-components'

import CoinIcon from 'public/ic-coin.svg'

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
  | 'copy'
  | 'done'
  | 'ether'
  | 'info'
  | 'link'
  | 'lock'
  | 'radioOff'
  | 'radioOn'
  | 'refreshOff'
  | 'refreshOn'
  | 'unlock'
  | 'warning'
  | 'wncgDark'
  | 'wncgLight'

export type SvgIconSize = 16 | 24 | 32 | 48

const StyledSvgIcon = styled.svg<{ $size: SvgIconSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => `${$size}px`};
  height: ${({ $size }) => `${$size}px`};
`

type SvgIconProps = {
  ariaLabel?: string
  ariaHidden?: boolean
  icon?: SvgIconType
  className?: string
  $size?: SvgIconSize
}

function SvgIcon({
  ariaLabel,
  ariaHidden,
  icon,
  className,
  $size = 24,
}: SvgIconProps) {
  if (!icon) return null

  if (icon === 'coin')
    return (
      <StyledSvgIcon
        className={className}
        as="span"
        aria-label={ariaLabel}
        aria-hidden={ariaHidden}
        $size={$size}
      >
        <CoinIcon />
      </StyledSvgIcon>
    )

  return (
    <StyledSvgIcon
      className={className}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      $size={$size}
    >
      <use href={`/new-sprites.svg#${icon}`} />
    </StyledSvgIcon>
  )
}

export default memo(SvgIcon)
