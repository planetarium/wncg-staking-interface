import type { PropsWithChildren } from 'react'
import clsx from 'clsx'

import { bnum } from 'utils/bnum'

import { StyledCheckout } from './styled'
import CountUp from 'components/CountUp'

type CheckoutProps = {
  amount: string
  message: string
  className?: string
  htmlFor?: string
  prefix?: string
  symbol?: string
  type?: 'token' | 'fiat'
} & PropsWithChildren

export default function Checkout({
  amount,
  message,
  className,
  htmlFor,
  prefix,
  symbol,
  type = 'token',
  children,
}: CheckoutProps) {
  const isActive = bnum(amount).gt(0)

  return (
    <StyledCheckout
      className={clsx('checkout', className)}
      htmlFor={htmlFor}
      $active={isActive}
    >
      <span className="text">{message}</span>
      <div className="value">
        <CountUp
          value={amount}
          duration={0.5}
          prefix={prefix}
          symbol={symbol}
          decimals={type === 'token' ? 8 : undefined}
          type={type}
        />
      </div>

      {children}
    </StyledCheckout>
  )
}
