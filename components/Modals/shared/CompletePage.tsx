import { ReactNode } from 'react'

import { ANIMATION_MAP, MOTION } from 'config/constants/motions'

import { StyledModalCompletePage } from './styled'
import Lottie from 'components/Lottie'

type ModalCompletePageProps = {
  children: ReactNode
  className?: string
}

function ModalCompletePage({ children, className }: ModalCompletePageProps) {
  return (
    <StyledModalCompletePage
      {...MOTION}
      className={className}
      variants={ANIMATION_MAP.fadeIn}
    >
      <Lottie className="lottie" animationData="completed" />

      {children}
    </StyledModalCompletePage>
  )
}

export default ModalCompletePage
