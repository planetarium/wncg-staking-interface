import { memo, PropsWithChildren } from 'react'
import type { Transition } from 'framer-motion'

import { fadeIn, appearInUp } from 'constants/motionVariants'

import { StyledModalPage } from './styled'
import { useAtomValue } from 'jotai'
import { isMobileAtom } from 'states/ui'

type ModalPageProps = {
  className?: string
  id?: string
  transition?: Transition
} & PropsWithChildren

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
