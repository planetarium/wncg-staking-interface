import { useRecoilValue } from 'recoil'
import { AnimatePresence } from 'framer-motion'

import { modalListState } from 'app/states/modal'

import { ModalPortal } from './Portal'
import { ModalView } from './View'

export function Modal() {
  const modalList = useRecoilValue(modalListState)

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
