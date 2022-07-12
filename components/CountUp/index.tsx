import { useEffect, useState } from 'react'
import { usePrevious } from 'react-use'
import ReactCountUp, { CountUpProps as ReactCountUpProps } from 'react-countup'
import clsx from 'clsx'
import styles from './style.module.scss'

import { getIsConnected, getIsValidNetwork } from 'app/states/connection'
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
  const isValidNetwork = useAppSelector(getIsValidNetwork)

  const invalidEnd = !new Decimal(end).isFinite() || new Decimal(end).isNaN()
  const showDash =
    !isConnected ||
    !isValidNetwork ||
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
