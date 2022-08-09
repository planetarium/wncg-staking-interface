import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from 'app/store'

import Decimal, { sanitizeNumber } from 'utils/num'

type BptState = {
  isApproved: boolean
  totalStaked: string | null
}

const INITIAL_STATE: BptState = {
  isApproved: false,
  totalStaked: null,
}

const bptSlice = createSlice({
  name: '#bpt',
  initialState: INITIAL_STATE,
  reducers: {
    setIsApproved(state: BptState, action: PayloadAction<boolean>) {
      state.isApproved = action.payload
    },
    setTotalStaked(state: BptState, action: PayloadAction<string | null>) {
      state.totalStaked = action.payload
    },
    resetBpt() {
      return INITIAL_STATE
    },
  },
})

export const { setIsApproved, setTotalStaked, resetBpt } = bptSlice.actions
export default bptSlice.reducer

// Selectors
export function getIsApproved(state: RootState): boolean {
  return state.bpt.isApproved
}
export function getTotalStaked(state: RootState): string {
  return state.bpt.totalStaked || '0'
}
