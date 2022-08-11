import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'app/store'

export const ModalCategory = {
  ClaimReward: 'MODAL_CATEGORY_CLAIM_REWARD',
  Connect: 'MODAL_CATEGORY_CONNECT',
  Error: 'MODAL_CATEGORY_ERROR',
  InvestPreview: 'MODAL_INVEST_PREVIEW',
  MetaMaskGuide: 'MODAL_CATEGORY_METAMASK_GUIDE',
  StakeWarning: 'MODAL_CATEGORY_STAKE_WARNING',
  WithdrawPreview: 'MODAL_CATEGORY_WITHDRAW_PREVIEW',
} as const
export type ModalCategory = typeof ModalCategory[keyof typeof ModalCategory]

export type Modal = {
  category: ModalCategory
  props?: any
}

type ModalState = {
  modals: Modal[]
}

const INITIAL_STATE: ModalState = {
  modals: [],
}

const modalSlice = createSlice({
  name: '#modal',
  initialState: INITIAL_STATE,
  reducers: {
    addModal(state: ModalState, action: PayloadAction<Modal>) {
      const existingModalIndex = state.modals.findIndex(
        (modal) => modal.category === action.payload.category
      )
      if (existingModalIndex < 0) {
        state.modals.push(action.payload)
      } else {
        state.modals[existingModalIndex] = action.payload
      }
    },
    removeModal(
      state: ModalState,
      action: PayloadAction<ModalCategory | undefined>
    ) {
      if (!action.payload) {
        state.modals.pop()
        return
      }
      const targetModalIndex = state.modals.findIndex(
        (modal) => modal.category === action.payload
      )
      state.modals.splice(targetModalIndex, 1)
    },
  },
})

export const { addModal, removeModal } = modalSlice.actions
export default modalSlice.reducer

// Selector
export function getModals(state: RootState) {
  return state.modal.modals
}
