import { memo, PropsWithChildren } from 'react'

import { MOTION } from 'config/motions'
import { fadeIn } from 'config/motionVariants'

import { StyledModalPage } from './styled'

type ModalPageProps = {
  className?: string
  $disabled?: boolean
} & PropsWithChildren

function ModalPage({ children, className, $disabled }: ModalPageProps) {
  return (
    <StyledModalPage
      {...MOTION}
      className={className}
      variants={fadeIn}
      $disabled={$disabled}
    >
      {children}
    </StyledModalPage>
  )
}

export default memo(ModalPage)
