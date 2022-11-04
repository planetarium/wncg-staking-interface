import { memo, ReactNode } from 'react'
import { useAtomValue } from 'jotai'
import type { Transition } from 'framer-motion'

import { isMobileAtom } from 'states/ui'
import { fadeIn, appearInUp } from 'constants/motionVariants'

import { StyledModalPage } from './styled'

type ModalPageProps = {
  children: ReactNode
  className?: string
  id?: string
  transition?: Transition
}

function ModalPage({ children, className, id, transition }: ModalPageProps) {
  const isMobile = useAtomValue(isMobileAtom)
  const variants = isMobile ? appearInUp : fadeIn

  return (
    <StyledModalPage
      id={id}
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={transition}
    >
      {children}
    </StyledModalPage>
  )
}

export default memo(ModalPage)
