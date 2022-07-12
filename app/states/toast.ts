import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from 'app/store'

type ToastState = {
  toasts: string[]
}

const INITIAL_STATE: ToastState = {
  toasts: [],
}

const toastSlice = createSlice({
  name: '#toast',
  initialState: INITIAL_STATE,
  reducers: {
    addToast(state: ToastState, action: PayloadAction<string>) {
      state.toasts.push(action.payload)
    },
    removeToast(state: ToastState, action: PayloadAction<string>) {
      const index = state.toasts.findIndex((t) => t === action.payload)
      state.toasts.splice(index, 1)
    },
  },
})

export const { addToast, removeToast } = toastSlice.actions
export default toastSlice.reducer

// Selector
export function getToasts(state: RootState) {
  return state.toast.toasts
}
