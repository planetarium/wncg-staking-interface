import { useResponsive } from 'hooks'

import Skeleton from 'components/Skeleton'

type StakingDashboardAprItemLoadingProps = {
  label?: string
  $width?: number
}

export default function StakingDashboardAprItemLoading({
  label,
  $width = 80,
}: StakingDashboardAprItemLoadingProps) {
  const { isHandheld } = useResponsive()

  if (isHandheld) {
    return (
      <>
        <Skeleton className="aprItem" $width={$width} $height={20} $mt={2} />
      </>
    )
  }

  return (
    <>
      <div className="aprItem">
        <dt>
          {label ? (
            `${label} APR`
          ) : (
            <Skeleton className="aprItem" $width={60} $height={20} />
          )}
        </dt>
        <dd>
          <Skeleton className="aprItem" $width={80} $height={48} />
        </dd>
      </div>
    </>
  )
}
