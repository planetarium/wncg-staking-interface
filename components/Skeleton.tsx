import clsx from 'clsx'

import { EXIT_MOTION } from 'config/motions'

import { StyledSkeleton } from './styled'
import { useMemo } from 'react'

type SkeletonProps = {
  $height?: number | string
  $type?: 'light' | 'dark'
  $width?: number | string
  $wrapperHeight?: number | string
  $radius?: number
  $mt?: number
  $mr?: number
  $ml?: number
  $mb?: number
  className?: string
}

export default function Skeleton({
  $width,
  $height = '100%',
  $type = 'dark',
  $wrapperHeight = $height,
  $radius,
  $mt,
  $mr,
  $ml,
  $mb,
  className,
}: SkeletonProps) {
  const borderRadius = useMemo(() => {
    if ($radius) return $radius
    if (typeof $height === 'number') return $height >= 24 ? 8 : 4
    return 8
  }, [$height, $radius])

  return (
    <StyledSkeleton
      className={clsx('skeleton', className)}
      {...EXIT_MOTION}
      style={{
        width: $width ?? '100%',
        height: $wrapperHeight,
        marginTop: $mt,
        marginRight: $mr,
        marginBottom: $mb,
        marginLeft: $ml,
      }}
      $type={$type}
      aria-hidden
    >
      <span
        style={{
          height: $height,
          borderRadius,
        }}
      />
    </StyledSkeleton>
  )
}
