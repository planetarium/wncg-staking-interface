import { memo } from 'react'

import { ESTIMATION_PERIODS as periods } from 'constants/time'

import { StyledEarningsEstimate } from './styled'
import Item from './Item'

type EarningsEstimateProps = {
  className?: string
}

function EarningsEstimate({ className }: EarningsEstimateProps) {
  return (
    <StyledEarningsEstimate className={className}>
      {periods.map((period) => {
        return (
          <li key={`earningsEstimate:${period}`}>
            <Item period={period} />
          </li>
        )
      })}
    </StyledEarningsEstimate>
  )
}

export default memo(EarningsEstimate)
