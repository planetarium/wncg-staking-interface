import type { MouseEvent, PropsWithChildren } from 'react'
import clsx from 'clsx'

import { StyledTooltip } from './styled'
import Icon from 'components/Icon'

type TooltipProps = {
  className?: string
  closeButton?: boolean
  message?: string
  onClick?(e: MouseEvent): void
  onAttemptToClose?(e: MouseEvent): void
  as?: any
  $align?: 'center' | 'left' | 'right'
  $direction?: 'top' | 'right' | 'bottom' | 'left'
  $float?: boolean
  $gap?: number
  $width?: number | 'auto' | 'initial'
  $noWrap?: boolean
} & PropsWithChildren

export default function Tooltip({
  children,
  closeButton = false,
  className,
  message,
  onClick,
  onAttemptToClose,
  as,
  $align = 'center',
  $direction = 'top',
  $float = false,
  $gap = 8,
  $noWrap = false,
  $width = 'auto',
}: TooltipProps) {
  return (
    <StyledTooltip
      className={clsx('tooltip', className)}
      onClick={onClick}
      as={as}
      role={onClick ? 'button' : undefined}
      $direction={$direction}
      $gap={$gap}
      $width={$width}
      $align={$align}
      $noWrap={$noWrap}
      $float={$float}
      $clickable={!!onClick}
    >
      {message}
      {children}

      {closeButton && (
        <button
          className="closeButton"
          type="button"
          onClick={onAttemptToClose}
        >
          <Icon icon="close" />
        </button>
      )}
    </StyledTooltip>
  )
}
