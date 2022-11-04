import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  forwardRef,
  ForwardedRef,
  MouseEvent,
  ReactNode,
} from 'react'

import { ButtonSize, ButtonVariant, StyledButton, StyledLink } from './styled'
import SvgIcon, { SvgIconType } from '../SvgIcon'
import ConnectorIcon from 'components/ConnectorIcon'

const nonScalableButtonVariants: ButtonVariant[] = ['text', 'tiny']

export type ButtonProps = {
  children: ReactNode
  ariaLabel?: string
  as?: string
  dataset?: Record<string, string>
  href?: string
  leftIcon?: SvgIconType
  loading?: boolean
  onClick?: (e: MouseEvent) => void
  prefetch?: boolean
  rightIcon?: SvgIconType
  target?: string
  $contain?: boolean
  $size?: ButtonSize
  $variant?: ButtonVariant
}

function Button(
  {
    children,
    ariaLabel,
    as,
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
    $contain = false,
    $size: _$size = 'lg',
    $variant = 'primary',
    ...buttonProps
  }: ButtonProps &
    DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
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
        type={type}
        ref={ref as any}
        disabled={disabled}
        onClick={onClick}
        aria-label={ariaLabel}
        $contain={$contain}
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

  return (
    <StyledLink
      id={id}
      className={className}
      prefetch={prefetch}
      href={href}
      ref={ref as ForwardedRef<HTMLAnchorElement>}
      onClick={onClick}
      target={target}
      rel={target === '_blank' ? 'noopener' : undefined}
      aria-label={ariaLabel}
      $contain={$contain}
      $size={$size}
      $variant={$variant}
      {...datasetMap}
    >
      {label}
    </StyledLink>
  )
}

export default forwardRef(Button)
