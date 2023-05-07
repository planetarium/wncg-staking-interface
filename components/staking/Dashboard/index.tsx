import { memo } from 'react'

import { StyledStakingDashboardApr, StyledStakingDashboard } from './styled'
import Image from 'components/Image'
import Suspense from 'components/Suspense'
import Apr from './Apr'

function StakingDashboard() {
  return (
    <StyledStakingDashboard>
      <div className="imageContainer">
        <Image className="image" src="/apngb-app.png" alt="" priority />
      </div>

      <Suspense
        fallback={<StyledStakingDashboardApr as="div" $fallback aria-hidden />}
      >
        <Apr />
      </Suspense>
    </StyledStakingDashboard>
  )
}

export default memo(StakingDashboard)
