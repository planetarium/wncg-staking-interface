import { memo } from 'react'

import { StyledStakingDashboard } from './styled'
import Image from 'components/Image'
import Suspense from 'components/Suspense'
import Apr from './Apr'
import Fallback from './Fallback'

function StakingDashboard() {
  return (
    <StyledStakingDashboard>
      <div className="imageContainer">
        <Image
          className="image"
          src="/wncg-3d.png"
          alt="Wrapped nine chronicles gold"
          priority
        />
      </div>

      <Suspense fallback={<Fallback />}>
        <Apr />
      </Suspense>
    </StyledStakingDashboard>
  )
}

export default memo(StakingDashboard)
