import { MouseEvent, useMemo } from 'react'
import { useKey } from 'react-use'
import dynamic from 'next/dynamic'
import { useAtomValue } from 'jotai'
import { AnimatePresence } from 'framer-motion'

import { modalAtom } from 'states/ui'
import { ANIMATION_MAP, EXIT_MOTION } from 'config/constants/motions'
import { useModal, useResponsive } from 'hooks'

import { StyledModalContainer, StyledModalOverlay } from './styled'
import Suspense from 'components/Suspense'
import Portal from './Portal'
import View from './View'

function Modals() {
  const { removeModal } = useModal()
  const { bp } = useResponsive()

  const modal = useAtomValue(modalAtom)

  const isPortable = useMemo(() => bp === 'mobile' || bp === 'tablet', [bp])

  const motionVariants = useMemo(
    () => (isPortable ? ANIMATION_MAP.appearInUp : ANIMATION_MAP.popInCenter),
    [isPortable]
  )

  function closeModal(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
    removeModal()
  }

  useKey('Escape', removeModal)

  return (
    <Portal>
      <AnimatePresence>
        {modal && (
          <StyledModalOverlay
            {...EXIT_MOTION}
            variants={ANIMATION_MAP.fadeIn}
            transition={{ duration: 0.4 }}
            onClick={closeModal}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modal && (
          <StyledModalContainer
            {...EXIT_MOTION}
            variants={motionVariants}
            transition={{ duration: 0.4 }}
          >
            <Suspense>
              <View modal={modal} />
            </Suspense>
          </StyledModalContainer>
        )}
      </AnimatePresence>
    </Portal>
  )
}

export default dynamic(() => Promise.resolve(Modals), { ssr: false })
