import { useEffect, useState } from 'react'
import { usePrevious } from 'react-use'
import ReactCountUp, { CountUpProps as ReactCountUpProps } from 'react-countup'
import { useRecoilValue } from 'recoil'
import clsx from 'clsx'
import styles from './style.module.scss'

import { getIsConnected } from 'app/states/connection'
import { networkMismatchState } from 'app/states/network'
import Decimal, { sanitizeNumber } from 'utils/num'
import { useAppSelector } from 'hooks'

import { Icon } from '../Icon'

type CountUpProps = ReactCountUpProps & {
  isApproximate?: boolean
  showTitle?: boolean
  showDashWhenZero?: boolean
}

export function CountUp({
  className,
  end,
  isApproximate,
  showTitle = true,
  showDashWhenZero = false,
  ...countUpProps
}: CountUpProps) {
  const [start, setStart] = useState(0)
  const prevEnd = usePrevious(Number(sanitizeNumber(end))) || 0

  const isConnected = useAppSelector(getIsConnected)
  const networkMismatch = useRecoilValue(networkMismatchState)

  const invalidEnd = !new Decimal(end).isFinite() || new Decimal(end).isNaN()
  const showDash =
    !isConnected ||
    networkMismatch ||
    invalidEnd ||
    (showDashWhenZero && new Decimal(end).isZero())

  const nestedClassName = clsx(className, { [styles.usd]: isApproximate })

  useEffect(() => {
    if (prevEnd !== end) {
      setStart(prevEnd)
    }
  }, [end, prevEnd])

  if (showDash || !new Decimal(end).isFinite()) {
    return (
      <div className={nestedClassName}>
        {isApproximate && <Icon id="approximate" ariaHidden />}-
      </div>
    )
  }

  const title = showTitle ? sanitizeNumber(end) : undefined

  return (
    <div className={nestedClassName} title={title}>
      {isApproximate && <Icon id="approximate" ariaHidden />}
      <ReactCountUp {...countUpProps} start={start} end={end} />
    </div>
  )
}
