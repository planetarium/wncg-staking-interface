import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from 'app/store'

type BalanceState = {
  bptBalance: string | null
  ethBalance: string | null
  wethBalance: string | null
  wncgBalance: string | null
}

const INITIAL_STATE: BalanceState = {
  bptBalance: null,
  ethBalance: null,
  wethBalance: null,
  wncgBalance: null,
}

const balanceSlice = createSlice({
  name: '#balance',
  initialState: INITIAL_STATE,
  reducers: {
    setBptBalance(state: BalanceState, action: PayloadAction<string>) {
      state.bptBalance = action.payload
    },
    setEthBalance(state: BalanceState, action: PayloadAction<string>) {
      state.ethBalance = action.payload
    },
    setWethBalance(state: BalanceState, action: PayloadAction<string>) {
      state.wethBalance = action.payload
    },
    setWncgBalance(state: BalanceState, action: PayloadAction<string>) {
      state.wncgBalance = action.payload
    },
    resetBalance() {
      return INITIAL_STATE
    },
  },
})

export const {
  setBptBalance,
  setEthBalance,
  setWethBalance,
  setWncgBalance,
  resetBalance,
} = balanceSlice.actions
export default balanceSlice.reducer

// Selectors
export function getBptBalance(state: RootState): string {
  return state.balance.bptBalance || '0'
}

export function getEthBalance(state: RootState): string {
  return state.balance.ethBalance || '0'
}

export function getWethBalance(state: RootState): string {
  return state.balance.wethBalance || '0'
}

export function getWncgBalance(state: RootState): string {
  return state.balance.wncgBalance || '0'
}
