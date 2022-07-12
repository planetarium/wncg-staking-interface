import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  ForwardedRef,
  forwardRef,
  MouseEvent,
  ReactNode,
  useMemo,
} from 'react'
import Link from 'next/link'
import Lottie from 'lottie-react'
import clsx from 'clsx'
import styles from './style.module.scss'

import loadingAnimation from 'animations/loading.json'

type ButtonSize = 'small' | 'medium' | 'large'
type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger'

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  children: ReactNode
  ariaLabel?: string
  fullWidth?: boolean
  href?: string
  loading?: boolean
  onClick?: (e: MouseEvent) => void
  prefetch?: boolean
  size?: ButtonSize
  target?: string
  variant?: ButtonVariant
}

function Button(
  {
    children,
    ariaLabel,
    className,
    disabled,
    fullWidth,
    href,
    id,
    loading,
    onClick,
    prefetch,
    size = 'medium',
    target,
    type = 'button',
    variant = 'primary',
    ...props
  }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement | HTMLAnchorElement>
) {
  const nestedClassName = useMemo(
    () =>
      clsx(
        {
          [styles.btnPrimary]: variant === 'primary',
          [styles.btnSecondary]: variant === 'secondary',
          [styles.btnTertiary]: variant === 'tertiary',
          [styles.btnDanger]: variant === 'danger',
          [styles.btnSmall]: size === 'small',
          [styles.btnMedium]: size === 'medium',
          [styles.btnLarge]: size === 'large',
          [styles.full]: fullWidth,
          [styles.disabled]: disabled,
        },
        className
      ),
    [className, disabled, fullWidth, size, variant]
  )

  if (!href) {
    return (
      <button
        className={nestedClassName}
        ref={ref as ForwardedRef<HTMLButtonElement>}
        type={type}
        disabled={disabled}
        onClick={onClick}
        aria-label={ariaLabel}
        {...props}
      >
        {loading && (
          <Lottie
            className={styles.lottie}
            animationData={loadingAnimation}
            loop
          />
        )}
        {children}
      </button>
    )
  }

  const anchorElement = (
    <a
      className={nestedClassName}
      id={id}
      ref={ref as ForwardedRef<HTMLAnchorElement>}
      href={href}
      onClick={onClick}
      target={target}
      rel={target === '_blank' ? 'noopener' : undefined}
      aria-label={ariaLabel}
    >
      {loading && (
        <Lottie
          className={styles.lottie}
          animationData={loadingAnimation}
          loop
        />
      )}
      {children}
    </a>
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

const FowardedButton = forwardRef(Button)
export { FowardedButton as Button }
