import { useResponsive } from 'hooks'

import { StyledStakingDashboardApr } from './styled'
import Skeleton from 'components/Skeleton'

export default function StakingDashboardAprFallback() {
  const { isHandheld } = useResponsive()

  if (isHandheld) {
    return (
      <StyledStakingDashboardApr className="aprList">
        <Skeleton className="aprItem" $width={170} $height={20} />
        <Skeleton className="aprItem" $width={80} $height={20} $mt={2} />
        <Skeleton className="aprItem" $width={100} $height={20} $mt={2} />
      </StyledStakingDashboardApr>
    )
  }

  return (
    <StyledStakingDashboardApr className="aprList">
      <div className="aprItem">
        <dt>
          <Skeleton className="aprItem" $width={83} $height={20} />
        </dt>
        <dd>
          <Skeleton className="aprItem" $width={120} $height={48} />
        </dd>
      </div>

      <div className="aprItem">
        <dt>
          <Skeleton className="aprItem" $width={60} $height={20} />
        </dt>
        <dd>
          <Skeleton className="aprItem" $width={80} $height={48} />
        </dd>
      </div>

      <div className="aprItem">
        <dt>
          <Skeleton className="aprItem" $width={72} $height={20} />
        </dt>
        <dd>
          <Skeleton className="aprItem" $width={72} $height={48} />
        </dd>
      </div>
    </StyledStakingDashboardApr>
  )
}
