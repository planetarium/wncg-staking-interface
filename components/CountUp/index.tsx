import { useEffect, useState } from 'react'
import { usePrevious } from 'react-use'
import ReactCountUp, { CountUpProps as ReactCountUpProps } from 'react-countup'
import { useRecoilValue } from 'recoil'
import clsx from 'clsx'
import styles from './style.module.scss'

import { getIsConnected } from 'app/states/connection'
import { networkMismatchState } from 'app/states/network'
import { bnum, sanitizeNumber } from 'utils/num'
import { useAppSelector } from 'hooks'

import { Icon } from '../Icon'

type CountUpProps = Omit<ReactCountUpProps, 'end'> & {
  end: string | number
  isApproximate?: boolean
  showAlways?: boolean
  showTitle?: boolean
}

export function CountUp({
  end,
  className,
  isApproximate = false,
  showAlways = false,
  showTitle = true,
  ...countUpProps
}: CountUpProps) {
  const [start, setStart] = useState(0)
  const prevEnd = usePrevious(Number(sanitizeNumber(end))) || 0

  const isConnected = useAppSelector(getIsConnected)
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
      <ReactCountUp {...countUpProps} start={start} end={bEnd.toNumber()} />
    </div>
  )
}
