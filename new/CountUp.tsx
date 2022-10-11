import { useEffect, useState } from 'react'
import { usePrevious } from 'react-use'
import ReactCountUp from 'react-countup'
import type { CountUpProps as ReactCountUpProps } from 'react-countup'
import styled from 'styled-components'

import { bnum, isLessThanMinAmount, sanitizeNumber } from 'utils/num'
import { useAccount } from 'hooks'
import { inlineFlexbox } from 'newStyles/utils'

import SvgIcon from './SvgIcon'

const StyledCountUp = styled.div`
  ${inlineFlexbox()};
`

type CountUpProps = Omit<ReactCountUpProps, 'end'> & {
  end: string | number
  isApproximate?: boolean
  showAlways?: boolean
  showTitle?: boolean
  minAmount?: number
}

function CountUp({
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

  const bEnd = bnum(end)
  const invalidValue = !bEnd.isFinite() || bEnd.isNaN()
  const showDash = invalidValue || (!showAlways && !isConnected)

  useEffect(() => {
    if (prevEnd !== Number(sanitizeNumber(end))) setStart(prevEnd)
  }, [end, prevEnd, start])

  if (showDash) {
    return (
      <StyledCountUp className={className}>
        {isApproximate && <SvgIcon icon="approximate" ariaHidden />}-
      </StyledCountUp>
    )
  }

  return (
    <StyledCountUp
      className={className}
      title={showTitle ? sanitizeNumber(end) : undefined}
    >
      {isApproximate && <SvgIcon icon="approximate" ariaHidden />}
      {isLessThanMinAmount(bEnd.toNumber(), minAmount) ? (
        `< ${countUpProps.prefix ? countUpProps.prefix : ''}${minAmount}${
          countUpProps.suffix ? countUpProps.suffix : ''
        }`
      ) : (
        <ReactCountUp {...countUpProps} start={start} end={bEnd.toNumber()} />
      )}
    </StyledCountUp>
  )
}

export default CountUp
