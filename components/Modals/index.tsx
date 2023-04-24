import { MouseEvent, useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { AnimatePresence } from 'framer-motion'

import { modalAtom } from 'states/ui'
import { EXIT_MOTION } from 'config/motions'
import { useModal, useResponsive } from 'hooks'
import {
  modalDesktopVariants,
  modalMobileVariants,
  modalOverlayVariants,
  modalTransition,
} from './constants'

import { StyledModalContainer, StyledModalOverlay } from './styled'
import Portal from './Portal'
import View from './View'

function Modals() {
  const { removeModal } = useModal()
  const { bp } = useResponsive()

  const modal = useAtomValue(modalAtom)

  const isPortable = useMemo(() => bp === 'mobile' || bp === 'tablet', [bp])

  const motionVariants = useMemo(
    () => (isPortable ? modalMobileVariants : modalDesktopVariants),
    [isPortable]
  )

  function closeModal(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
    removeModal()
  }

  return (
    <Portal>
      <AnimatePresence>
        {modal && (
          <StyledModalOverlay
            {...EXIT_MOTION}
            variants={modalOverlayVariants}
            transition={modalTransition}
            onClick={closeModal}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modal && (
          <StyledModalContainer
            {...EXIT_MOTION}
            variants={motionVariants}
            transition={modalTransition}
          >
            <View modal={modal} />
          </StyledModalContainer>
        )}
      </AnimatePresence>
    </Portal>
  )
}

export default Modals
