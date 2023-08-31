import { Suspense } from 'react'
import dynamic from 'next/dynamic'

import { StyledStakingDashboard } from './styled'
import Image from 'components/Image'
import Apr from './Apr'
import Fallback from './Fallback'

function StakingDashboard() {
  return (
    <StyledStakingDashboard>
      <div className="imageContainer">
        <Image
          className="image"
          src="/wncg-3d.webp"
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

export default dynamic(() => Promise.resolve(StakingDashboard), { ssr: false })
