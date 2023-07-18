import { memo } from 'react'
import dynamic from 'next/dynamic'

import { StyledStakingDashboard } from './styled'
import Image from 'components/Image'
import Suspense from 'components/Suspense'
import Fallback from './Fallback'

const Apr = dynamic(() => import('./Apr'), {
  ssr: false,
})

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

export default memo(StakingDashboard)
