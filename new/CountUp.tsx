import { useEffect, useState } from 'react'
import { usePrevious } from 'react-use'
import ReactCountUp, { CountUpProps as ReactCountUpProps } from 'react-countup'
import clsx from 'clsx'

import { bnum, sanitizeNumber } from 'utils/num'
import { useAccount } from 'hooks'

import { StyledCountUp, SvgIconSize } from './styled'

type CountUpProps = {
  end: string | number
  showAlways?: boolean
  showTitle?: boolean
  minAmount?: number
  $iconSize?: SvgIconSize
}

function CountUp({
  end,
  className,
  showAlways = false,
  showTitle = true,
  minAmount = 0.0001,
  $iconSize = 16,
  ...countUpProps
}: CountUpProps & Omit<ReactCountUpProps, 'end'>) {
  const [start, setStart] = useState(0)
  const prevEnd = usePrevious(Number(sanitizeNumber(end))) || 0

  const { isConnected } = useAccount()

  const bEnd = bnum(end)
  const invalidValue = !bEnd.isFinite() || bEnd.isNaN()
  const showDash = invalidValue || (!showAlways && !isConnected)

  useEffect(() => {
    if (prevEnd !== Number(sanitizeNumber(end))) setStart(prevEnd)
  }, [end, prevEnd, start])

  if (showDash) {
    return (
      <StyledCountUp className={clsx('countUp', className)}>-</StyledCountUp>
    )
  }

  return (
    <StyledCountUp
      className={clsx('countUp', className)}
      title={showTitle ? sanitizeNumber(end) : undefined}
    >
      <ReactCountUp {...countUpProps} start={start} end={bEnd.toNumber()} />
    </StyledCountUp>
  )
}

export default CountUp
