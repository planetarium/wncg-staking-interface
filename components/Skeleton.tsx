import { MOTION } from 'config/motions'
import { fadeIn } from 'config/motionVariants'

import { StyledSkeleton } from './styled'

type SkeletonProps = {
  width?: number | string
  height?: number | string
  radius?: number
}

export default function Skeleton({
  width = '100%',
  height,
  radius = 4,
}: SkeletonProps) {
  const style = {
    width,
    height,
    borderRadius: radius,
  }

  return (
    <StyledSkeleton {...MOTION} variants={fadeIn} style={style} aria-hidden>
      <span className="gradient" />
    </StyledSkeleton>
  )
}
