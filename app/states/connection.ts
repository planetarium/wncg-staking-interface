import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import store from 'store'

import type { RootState } from 'app/store'
import { STORE_ACCOUNT_KEY } from 'constants/storeKeys'

export const ConnectionStatus = {
  NotConnected: 'CONNECTION_STATUS_NOT_CONNECTED',
  Connecting: 'CONNECTION_STATUS_CONNECTING',
  Connected: 'CONNECTION_STATUS_CONNECTED',
} as const
export type ConnectionStatus =
  typeof ConnectionStatus[keyof typeof ConnectionStatus]

type ConnectionState = {
  account: string | null
  status: ConnectionStatus
}

const INITIAL_STATE: ConnectionState = {
  account: null,
  status: ConnectionStatus.NotConnected,
}

const connectionSlice = createSlice({
  name: '#connection',
  initialState: INITIAL_STATE,
  reducers: {
    setAccount: (state: ConnectionState, action: PayloadAction<string>) => {
      state.account = action.payload
      state.status = ConnectionStatus.Connected
      store.set(STORE_ACCOUNT_KEY, action.payload)
    },
    setConnecting: (state: ConnectionState) => {
      state.status = ConnectionStatus.Connecting
      state.account = null
      store.remove(STORE_ACCOUNT_KEY)
    },
    resetConnection: (state: ConnectionState) => {
      state.account = null
      state.status = ConnectionStatus.NotConnected
      store.remove(STORE_ACCOUNT_KEY)
    },
  },
})

export const { setAccount, setConnecting, resetConnection } =
  connectionSlice.actions
export default connectionSlice.reducer

// Selectors
export function getStatus(state: RootState): ConnectionStatus {
  return state.connection.status
}
export function getAccount(state: RootState): string | null {
  return state.connection.account
}
export const getIsConnected = createSelector([getStatus], (status) => {
  return status === ConnectionStatus.Connected
})
