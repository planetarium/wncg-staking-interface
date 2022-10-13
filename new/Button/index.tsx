import { forwardRef } from 'react'
import type {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  ForwardedRef,
  MouseEvent,
  ReactNode,
} from 'react'
import Link from 'next/link'

import { StyledButton } from './styled'
import type { ButtonSize, ButtonVariant } from './styled'
import SvgIcon from '../SvgIcon'
import type { SvgIconType } from '../SvgIcon'
import ConnectorIcon from 'new/ConnectorIcon'

const nonScalableButtonVariants: ButtonVariant[] = ['text', 'tiny']

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  children: ReactNode
  ariaLabel?: string
  dataset?: Record<string, string>
  href?: string
  leftIcon?: SvgIconType
  loading?: boolean
  onClick?: (e: MouseEvent) => void
  prefetch?: boolean
  rightIcon?: SvgIconType
  target?: string
  $size?: ButtonSize
  $variant?: ButtonVariant
}

function Button(
  {
    children,
    ariaLabel,
    className,
    dataset = {},
    disabled,
    href,
    id,
    leftIcon,
    loading,
    onClick,
    prefetch,
    rightIcon: _rightIcon,
    target,
    type = 'button',
    $size: _$size,
    $variant = 'primary',
    ...buttonProps
  }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement | HTMLAnchorElement>
) {
  const datasetMap = Object.fromEntries(
    Object.entries(dataset).map(([key, value]) => [`data-${key}`, value])
  )

  const rightIcon = $variant === 'text' ? 'chevronRight' : _rightIcon
  const $size = nonScalableButtonVariants.includes($variant)
    ? undefined
    : _$size

  const label = (
    <>
      {leftIcon && <SvgIcon className="leftIcon" icon={leftIcon} />}
      <span className="label">{children}</span>
      {rightIcon === 'metaMask' ? (
        <ConnectorIcon className="rightIcon" icon="metaMask" />
      ) : rightIcon ? (
        <SvgIcon className="rightIcon" icon={rightIcon} />
      ) : null}
    </>
  )

  if (!href) {
    return (
      <StyledButton
        className={className}
        as="button"
        type={type}
        ref={ref as any}
        disabled={disabled}
        onClick={onClick}
        aria-label={ariaLabel}
        $size={$size}
        $variant={$variant}
        {...datasetMap}
        {...(buttonProps as Partial<
          DetailedHTMLProps<
            ButtonHTMLAttributes<HTMLButtonElement>,
            HTMLButtonElement
          >
        >)}
      >
        {label}
      </StyledButton>
    )
  }

  const anchorElement = (
    <StyledButton
      className={className}
      as="a"
      id={id}
      ref={ref as ForwardedRef<HTMLAnchorElement>}
      href={href}
      onClick={onClick}
      target={target}
      rel={target === '_blank' ? 'noopener' : undefined}
      aria-label={ariaLabel}
      $size={$size}
      $variant={$variant}
      {...datasetMap}
    >
      {label}
    </StyledButton>
  )

  if (target === '_blank') {
    return anchorElement
  }

  return (
    <Link href={href} prefetch={prefetch}>
      {anchorElement}
    </Link>
  )
}

export default forwardRef(Button)
