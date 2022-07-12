import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from 'app/store'

import Decimal, { sanitizeNumber } from 'utils/num'
import { getBptPrice } from './token'

type BptState = {
  balance: string | null
  isApproved: boolean
  totalStaked: string | null
}

const INITIAL_STATE: BptState = {
  balance: null,
  isApproved: false,
  totalStaked: null,
}

const bptSlice = createSlice({
  name: '#bpt',
  initialState: INITIAL_STATE,
  reducers: {
    setBalance(state: BptState, action: PayloadAction<string | null>) {
      state.balance = action.payload
    },
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

export const { setBalance, setIsApproved, setTotalStaked, resetBpt } =
  bptSlice.actions
export default bptSlice.reducer

// Selectors
export function getBalance(state: RootState): string {
  return state.bpt.balance || '0'
}
export function getIsApproved(state: RootState): boolean {
  return state.bpt.isApproved
}
export function getTotalStaked(state: RootState): string {
  return state.bpt.totalStaked || '0'
}
export const getTotalStakedValue = createSelector(
  [getTotalStaked, getBptPrice],
  (totalStaked, bptPrice) => {
    return new Decimal(sanitizeNumber(totalStaked)).mul(bptPrice).toNumber()
  }
)
