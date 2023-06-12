import { memo, PropsWithChildren } from 'react'

import { ANIMATION_MAP, MOTION } from 'config/constants/motions'

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
      variants={ANIMATION_MAP.fadeIn}
      $disabled={$disabled}
    >
      {children}
    </StyledModalPage>
  )
}

export default memo(ModalPage)
