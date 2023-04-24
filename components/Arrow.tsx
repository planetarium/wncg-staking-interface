import clsx from 'clsx'

import { StyledArrow } from './styled'
import Icon from './Icon'

type ArrowProps = {
  className?: string
  type?: 'dashed' | 'hover'
  $size: IconSize
}

export default function Arrow({ className, $size = 24 }: ArrowProps) {
  return (
    <StyledArrow className={clsx('arrow', className)} aria-hidden $size={$size}>
      <Icon className="chevron" icon="chevronRight" $size={$size} />
      <Icon icon="chevronLine" $size={$size} />
    </StyledArrow>
  )
}
