import { Suspense } from 'react'
import { useAtomValue } from 'jotai'
import { AnimatePresence } from 'framer-motion'

import { modalsAtom } from 'states/ui'

import { ModalPortal } from './Portal'
import { ModalView } from './View'

function Modals() {
  const modalList = useAtomValue(modalsAtom)

  return (
    <ModalPortal>
      <AnimatePresence>
        {modalList.map((modal) => (
          <Suspense
            key={`modal:suspense:${modal.category}`}
            fallback={
              <div style={{ background: '#fff', color: '#000' }}>
                loading...
              </div>
            }
          >
            <ModalView key={`modal:${modal.category}`} modal={modal} />
          </Suspense>
        ))}
      </AnimatePresence>
    </ModalPortal>
  )
}

export default Modals
