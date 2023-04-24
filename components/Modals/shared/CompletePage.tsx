import { memo, ReactNode } from 'react'

import { MOTION } from 'config/motions'
import { fadeIn } from 'config/motionVariants'

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
      variants={fadeIn}
    >
      <Lottie className="lottie" animationData="completed" />

      {children}
    </StyledModalCompletePage>
  )
}

export default memo(ModalCompletePage)
