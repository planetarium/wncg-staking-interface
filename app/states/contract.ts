import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from 'app/store'

type ContractState = {
  balReward: string | null
  bpt: string | null
}

const INITIAL_STATE: ContractState = {
  balReward: null,
  bpt: null,
}

const contractSlice = createSlice({
  name: '#contract',
  initialState: INITIAL_STATE,
  reducers: {
    setBalRewardAddress(
      state: ContractState,
      action: PayloadAction<string | null>
    ) {
      state.balReward = action.payload
    },
    setBptAddress(state: ContractState, action: PayloadAction<string | null>) {
      state.bpt = action.payload
    },
  },
})

export const { setBalRewardAddress, setBptAddress } = contractSlice.actions
export default contractSlice.reducer

// Selectors
export function getBalRewardContractAddress(state: RootState): string {
  return state.contract.balReward || ''
}
export function getBptContractAddress(state: RootState): string {
  return state.contract.bpt || ''
}
