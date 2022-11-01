import { useEffect, useState } from 'react'
import { usePrevious } from 'react-use'
import ReactCountUp from 'react-countup'
import type { CountUpProps as ReactCountUpProps } from 'react-countup'

import { bnum, sanitizeNumber } from 'utils/num'
import { useAccount } from 'hooks'

import { StyledCountUp } from './styled'
import type { SvgIconSize } from './styled'

type CountUpProps = Omit<ReactCountUpProps, 'end'> & {
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
}: CountUpProps) {
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
    return <StyledCountUp className={className}>-</StyledCountUp>
  }

  return (
    <StyledCountUp
      className={className}
      title={showTitle ? sanitizeNumber(end) : undefined}
    >
      <ReactCountUp {...countUpProps} start={start} end={bEnd.toNumber()} />
    </StyledCountUp>
  )
}

export default CountUp
