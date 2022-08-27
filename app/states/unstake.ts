import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import store from 'store'

import type { RootState } from 'app/store'
import {
  STORE_COOLDOWN_ENDS_AT,
  STORE_IS_UNSTAKE_WINDOW_KEY,
  STORE_UNSTAKE_PERIOD_KEY,
  STORE_WITHDRAW_ENDS_AT,
} from 'constants/storeKeys'
import { getIsConnected } from './connection'
import { getIsStaked } from './stake'

export const UnstakeStatus = {
  NoCooldown: 'UNSTAKE_STATUS_NO_COOLDOWN',
  CooldownInProgress: 'UNSTAKE_STATUS_COOLDOWN_IN_PROGRESS',
  Withdrawable: 'UNSTAKE_STATUS_WITHDRAWABLE',
  NoStake: 'UNSTAKE_STATUS_NO_STAKE',
  NotConnected: 'UNSTAKE_STATUS_NOT_CONNECTED',
} as const
export type UnstakeStatus = typeof UnstakeStatus[keyof typeof UnstakeStatus]

type UnstakeState = {
  cooldownEndsAt: number | null
  withdrawEndsAt: number | null
  unstakePeriod: number | null
}

const INITIAL_STATE: UnstakeState = {
  cooldownEndsAt: null,
  withdrawEndsAt: null,
  unstakePeriod: store.get(STORE_UNSTAKE_PERIOD_KEY) || null,
}

const unstakeSlice = createSlice({
  name: '#unstake',
  initialState: INITIAL_STATE,
  reducers: {
    setCooldownEndsAt(state: UnstakeState, action: PayloadAction<number>) {
      state.cooldownEndsAt = action.payload
      store.set(STORE_COOLDOWN_ENDS_AT, action.payload)
    },
    setWithdrawEndsAt(state: UnstakeState, action: PayloadAction<number>) {
      state.withdrawEndsAt = action.payload
      store.set(STORE_IS_UNSTAKE_WINDOW_KEY, true)
      store.set(STORE_WITHDRAW_ENDS_AT, action.payload)
    },
    setUnstakePeriod(
      state: UnstakeState,
      action: PayloadAction<number | null>
    ) {
      state.unstakePeriod = action.payload
    },
    resetCooldownEndsAt(state: UnstakeState) {
      state.cooldownEndsAt = null
      store.remove(STORE_COOLDOWN_ENDS_AT)
    },
    resetWithdrawEndsAt(state: UnstakeState) {
      state.withdrawEndsAt = null
      store.set(STORE_IS_UNSTAKE_WINDOW_KEY, false)
      store.remove(STORE_WITHDRAW_ENDS_AT)
    },
    resetTimestamps(state: UnstakeState) {
      state.cooldownEndsAt = null
      state.withdrawEndsAt = null
    },
  },
})

export const {
  setCooldownEndsAt,
  setWithdrawEndsAt,
  setUnstakePeriod,
  resetCooldownEndsAt,
  resetWithdrawEndsAt,
  resetTimestamps,
} = unstakeSlice.actions
export default unstakeSlice.reducer

// Selectors
export function getCooldownEndsAt(state: RootState): number {
  return state.unstake.cooldownEndsAt || 0
}
export function getWithdrawEndsAt(state: RootState): number {
  return state.unstake.withdrawEndsAt || 0
}
export function getUnstakePeriod(state: RootState): number {
  return state.unstake.unstakePeriod || 0
}
export const getUnstakeStatus = createSelector(
  [getCooldownEndsAt, getWithdrawEndsAt, getIsConnected, getIsStaked],
  (cooldownEndsAt, withdrawEndsAt, isConnected, isStaked) => {
    const now = Date.now()
    switch (true) {
      case !isConnected:
        return UnstakeStatus.NotConnected
      case now < withdrawEndsAt && cooldownEndsAt < now:
        return UnstakeStatus.Withdrawable
      case now < cooldownEndsAt:
        return UnstakeStatus.CooldownInProgress
      case !isStaked:
        return UnstakeStatus.NoStake
      default:
        return UnstakeStatus.NoCooldown
    }
  }
)
export const getIsUnstakeWindow = createSelector(
  [getUnstakeStatus],
  (status) => {
    return (
      status === UnstakeStatus.CooldownInProgress ||
      status === UnstakeStatus.Withdrawable
    )
  }
)
