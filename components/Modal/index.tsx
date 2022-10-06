import { useAtomValue } from 'jotai'
import { AnimatePresence } from 'framer-motion'

import { modalsAtom } from 'states/ui'

import { ModalPortal } from './Portal'
import { ModalView } from './View'

function Modal() {
  const modalList = useAtomValue(modalsAtom)

  return (
    <ModalPortal>
      <AnimatePresence>
        {modalList.map((modal) => (
          <ModalView key={modal.category} modal={modal} />
        ))}
      </AnimatePresence>
    </ModalPortal>
  )
}

export default Modal
