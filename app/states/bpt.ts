import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from 'app/store'

type BptState = {
  isApproved: boolean
}

const INITIAL_STATE: BptState = {
  isApproved: false,
}

const bptSlice = createSlice({
  name: '#bpt',
  initialState: INITIAL_STATE,
  reducers: {
    setIsApproved(state: BptState, action: PayloadAction<boolean>) {
      state.isApproved = action.payload
    },
    resetBpt() {
      return INITIAL_STATE
    },
  },
})

export const { setIsApproved, resetBpt } = bptSlice.actions
export default bptSlice.reducer

// Selectors
export function getIsApproved(state: RootState): boolean {
  return state.bpt.isApproved
}
