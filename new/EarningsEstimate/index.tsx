import { memo } from 'react'

import { StyledEarningsEstimate } from './styled'

type EarningsEstimateProps = {
  className?: string
}

function EarningsEstimate({ className }: EarningsEstimateProps) {
  return <StyledEarningsEstimate>EarningsEstimate</StyledEarningsEstimate>
}

export default memo(EarningsEstimate)
