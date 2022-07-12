import { addModal, Modal, ModalCategory, removeModal } from 'app/states/modal'
import { useAppDispatch } from './useRedux'

export function useModal() {
  const dispatch = useAppDispatch()

  function dispatchAddModal(modal: Modal) {
    dispatch(addModal(modal))
  }

  function dispatchRemoveModal(category?: ModalCategory) {
    dispatch(removeModal(category))
  }

  return {
    addModal: dispatchAddModal,
    removeModal: dispatchRemoveModal,
  }
}
