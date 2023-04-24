import { useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'

import { modalAtom } from 'states/ui'

export function useModal() {
  const setModal = useSetAtom(modalAtom)

  function addModal(modal: Modal) {
    setModal(modal)
  }

  function removeModal() {
    setModal(RESET)
  }

  function updateModal(modal: Modal) {
    setModal(modal)
  }

  return {
    addModal,
    removeModal,
    updateModal,
  }
}
