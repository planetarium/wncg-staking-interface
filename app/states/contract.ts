import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from 'app/store'
import { getIsValidNetwork } from './connection'

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
export function getBalRewardAddress(state: RootState): string {
  return state.contract.balReward || ''
}
export function getBptAddress(state: RootState): string {
  return state.contract.bpt || ''
}
export const getBalRewardContractAddress = createSelector(
  [getBalRewardAddress, getIsValidNetwork],
  (address, isValidNetwork) => {
    return isValidNetwork ? address : ''
  }
)
export const getBptContractAddress = createSelector(
  [getBptAddress, getIsValidNetwork],
  (address, isValidNetwork) => {
    return isValidNetwork ? address : ''
  }
)
