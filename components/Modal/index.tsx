import { AnimatePresence } from 'framer-motion'

import { getModals } from 'app/states/modal'
import { useAppSelector } from 'hooks'

import { ModalPortal } from './Portal'
import { ModalView } from './View'

export function Modal() {
  const modals = useAppSelector(getModals)

  return (
    <ModalPortal>
      <AnimatePresence>
        {modals.map((modal) => (
          <ModalView key={modal.category} modal={modal} />
        ))}
      </AnimatePresence>
    </ModalPortal>
  )
}
