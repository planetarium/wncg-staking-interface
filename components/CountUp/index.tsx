import { useEffect, useState } from 'react'
import { usePrevious } from 'react-use'
import ReactCountUp, { CountUpProps as ReactCountUpProps } from 'react-countup'
import { useRecoilValue } from 'recoil'
import { useAccount } from 'wagmi'
import clsx from 'clsx'
import styles from './style.module.scss'

import { networkMismatchState } from 'app/states/error'
import { bnum, isLessThanMinAmount, sanitizeNumber } from 'utils/num'

import { Icon } from '../Icon'

type CountUpProps = Omit<ReactCountUpProps, 'end'> & {
  end: string | number
  isApproximate?: boolean
  showAlways?: boolean
  showTitle?: boolean
  minAmount?: number
}

export function CountUp({
  end,
  className,
  isApproximate = false,
  showAlways = false,
  showTitle = true,
  minAmount = 0.0001,
  ...countUpProps
}: CountUpProps) {
  const [start, setStart] = useState(0)
  const prevEnd = usePrevious(Number(sanitizeNumber(end))) || 0

  const { isConnected } = useAccount()
  const networkMismatch = useRecoilValue(networkMismatchState)

  const bEnd = bnum(end)
  const invalidValue = !bEnd.isFinite() || bEnd.isNaN()
  const showDash =
    invalidValue || networkMismatch || (!showAlways && !isConnected)

  const nestedClassName = clsx(className, { [styles.usd]: isApproximate })

  useEffect(() => {
    if (prevEnd !== end) setStart(prevEnd)
  }, [end, prevEnd])

  if (showDash) {
    return (
      <div className={nestedClassName}>
        {isApproximate && <Icon id="approximate" ariaHidden />}-
      </div>
    )
  }

  return (
    <div
      className={nestedClassName}
      title={showTitle ? sanitizeNumber(end) : undefined}
    >
      {isApproximate && <Icon id="approximate" ariaHidden />}
      {isLessThanMinAmount(bEnd.toNumber(), minAmount) ? (
        `< ${countUpProps.prefix ? countUpProps.prefix : ''}${minAmount}${
          countUpProps.suffix ? countUpProps.suffix : ''
        }`
      ) : (
        <ReactCountUp {...countUpProps} start={start} end={bEnd.toNumber()} />
      )}
    </div>
  )
}
