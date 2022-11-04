import { useSetAtom } from 'jotai'

import { Modal, ModalCategory, modalsAtom } from 'states/ui'

export function useModal() {
  const setModals = useSetAtom(modalsAtom)

  function addModal(modal: Modal) {
    setModals((prev) => {
      const newModals = [...prev]
      const existingModalIndex = newModals.findIndex(
        (item) => item.category === modal.category
      )

      if (existingModalIndex < 0) {
        newModals.push(modal)
      } else {
        newModals[existingModalIndex] = modal
      }

      return newModals
    })
  }

  function removeModal(category?: ModalCategory) {
    setModals((prev) => {
      const newModals = [...prev]
      if (category == null) {
        newModals.pop()
      } else {
        const targetModalIndex = newModals.findIndex(
          (modal) => modal.category === category
        )
        newModals.splice(targetModalIndex, 1)
      }

      return newModals
    })
  }

  return {
    addModal,
    removeModal,
  }
}
