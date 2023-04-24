import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  forwardRef,
  ForwardedRef,
  MouseEvent,
  ReactNode,
} from 'react'
import clsx from 'clsx'

import { StyledButton, StyledLink } from './styled'

export type ButtonProps = {
  children: ReactNode
  ariaLabel?: string
  as?: string
  dataset?: Record<string, string>
  href?: string
  loading?: boolean
  onClick?: (e: MouseEvent) => void
  prefetch?: boolean
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
    loading,
    onClick,
    prefetch,
    target,
    type = 'button',
    $contain = false,
    $size = 'lg',
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

  const label = <div className="label">{children}</div>

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
      className={clsx(className, { disabled })}
      prefetch={prefetch}
      href={disabled ? '' : href}
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
