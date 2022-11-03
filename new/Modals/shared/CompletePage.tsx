import { memo, ReactNode } from 'react'
import type { Transition } from 'framer-motion'

import { fadeIn } from 'constants/motionVariants'

import { StyledModalCompletePage } from './styled'

type ModalCompletePageProps = {
  children: ReactNode
  className?: string
  id?: string
  transition?: Transition
}

function ModalCompletePage({
  children,
  className,
  id,
  transition,
}: ModalCompletePageProps) {
  return (
    <StyledModalCompletePage
      id={id}
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeIn}
      transition={transition}
    >
      {children}
    </StyledModalCompletePage>
  )
}

export default memo(ModalCompletePage)
