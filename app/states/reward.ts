import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from 'app/store'

type RewardState = {
  earmarkIncentive: string | null
  earnedBal: string | null
  earnedWncg: string | null
  balEmissionPerSec: string | null
  wncgEmissionPerSec: string | null
}

const INITIAL_STATE: RewardState = {
  earnedBal: null,
  earnedWncg: null,
  earmarkIncentive: null,
  balEmissionPerSec: null,
  wncgEmissionPerSec: null,
}

const rewardSlice = createSlice({
  name: '#reward',
  initialState: INITIAL_STATE,
  reducers: {
    setEarmarkIncentive(
      state: RewardState,
      action: PayloadAction<string | null>
    ) {
      state.earmarkIncentive = action.payload
    },
    setEarnedBal(state: RewardState, action: PayloadAction<string | null>) {
      state.earnedBal = action.payload
    },
    setEarnedWncg(state: RewardState, action: PayloadAction<string | null>) {
      state.earnedWncg = action.payload
    },
    setBalEmissionPerSec(
      state: RewardState,
      action: PayloadAction<string | null>
    ) {
      state.balEmissionPerSec = action.payload
    },
    setWncgEmissionPerSec(
      state: RewardState,
      action: PayloadAction<string | null>
    ) {
      state.wncgEmissionPerSec = action.payload
    },
    resetRewards(state: RewardState) {
      state.earnedBal = null
      state.earnedWncg = null
    },
  },
})

export const {
  setEarmarkIncentive,
  setEarnedBal,
  setEarnedWncg,
  setBalEmissionPerSec,
  setWncgEmissionPerSec,
  resetRewards,
} = rewardSlice.actions
export default rewardSlice.reducer

// Selectors
export function getEarmarkIncentive(state: RootState): string {
  return state.reward.earmarkIncentive || '0'
}
export function getEarnedBal(state: RootState): string {
  return state.reward.earnedBal || '0'
}
export function getEarnedWncg(state: RootState): string {
  return state.reward.earnedWncg || '0'
}
export function getBalEmissionPerSec(state: RootState): string {
  return state.reward.balEmissionPerSec || '0'
}
export function getWncgEmissionPerSec(state: RootState): string {
  return state.reward.wncgEmissionPerSec || '0'
}
