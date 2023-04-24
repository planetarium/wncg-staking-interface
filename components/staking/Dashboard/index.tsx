import { memo } from 'react'

import { StyledDashboardApr, StyledStakingDashboard } from './styled'
import Image from 'components/Image'
import Suspense from 'components/Suspense'
import Apr from './Apr'

function StakingDashboard() {
  return (
    <StyledStakingDashboard>
      <div className="imageContainer">
        <Image className="image" src="/img-wncg-3d.png" alt="" priority />
      </div>

      <Suspense
        fallback={<StyledDashboardApr as="div" $fallback aria-hidden />}
      >
        <Apr />
      </Suspense>
    </StyledStakingDashboard>
  )
}

export default memo(StakingDashboard)
