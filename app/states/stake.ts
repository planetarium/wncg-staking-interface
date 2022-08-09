import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from 'app/store'
import Decimal from 'utils/num'

type StakeState = {
  stakedBalance: string | null
  totalStaked: string | null
}

const INITIAL_STATE: StakeState = {
  stakedBalance: null,
  totalStaked: null,
}

const stakeSlice = createSlice({
  name: '#stake',
  initialState: INITIAL_STATE,
  reducers: {
    setStakedBalance(state: StakeState, action: PayloadAction<string | null>) {
      state.stakedBalance = action.payload
    },
    setTotalStaked(state: StakeState, action: PayloadAction<string | null>) {
      state.totalStaked = action.payload
    },
    resetStakedBalance(state: StakeState) {
      state.stakedBalance = null
    },
  },
})

export const { setStakedBalance, setTotalStaked, resetStakedBalance } =
  stakeSlice.actions
export default stakeSlice.reducer

// Selectors
export function getStakedBalance(state: RootState): string {
  return state.stake.stakedBalance || '0'
}
export function getTotalStaked(state: RootState): string {
  return state.stake.totalStaked || '0'
}
export const getIsStaked = createSelector(
  [getStakedBalance],
  (stakedBalance) => {
    return !new Decimal(stakedBalance).isZero()
  }
)
