import { Modal, ModalCategory, modalListState } from 'app/states/modal'
import { useSetRecoilState } from 'recoil'

export function useModal() {
  const setModalList = useSetRecoilState(modalListState)

  function addModal(modal: Modal) {
    setModalList((prev) => {
      const newModalList = [...prev]
      const existingModalIndex = newModalList.findIndex(
        (item) => item.category === modal.category
      )

      if (existingModalIndex < 0) {
        newModalList.push(modal)
      } else {
        newModalList[existingModalIndex] = modal
      }

      return newModalList
    })
  }

  function removeModal(category?: ModalCategory) {
    setModalList((prev) => {
      const newModalList = [...prev]
      if (category == null) {
        newModalList.pop()
      } else {
        const targetModalIndex = newModalList.findIndex(
          (modal) => modal.category === category
        )
        newModalList.splice(targetModalIndex, 1)
      }

      return newModalList
    })
  }

  return {
    addModal,
    removeModal,
  }
}
