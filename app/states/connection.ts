import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import store from 'store'

import type { RootState } from 'app/store'
import { IS_ETHEREUM } from 'utils/env'
import { getIsPriceInvalid } from './token'

export const ConnectionStatus = {
  NotConnected: 'CONNECTION_STATUS_NOT_CONNECTED',
  Connecting: 'CONNECTION_STATUS_CONNECTING',
  Connected: 'CONNECTION_STATUS_CONNECTED',
} as const
export type ConnectionStatus =
  typeof ConnectionStatus[keyof typeof ConnectionStatus]

const MAINNET = IS_ETHEREUM ? 1 : 42

type ConnectionState = {
  account: string | null
  chainId: number | null
  status: ConnectionStatus
}

const INITIAL_STATE: ConnectionState = {
  account: null,
  chainId: null,
  status: ConnectionStatus.NotConnected,
}

const STORE_ACCOUNT_KEY = `wncgStaking.account`

const connectionSlice = createSlice({
  name: '#connection',
  initialState: INITIAL_STATE,
  reducers: {
    setAccount: (state: ConnectionState, action: PayloadAction<string>) => {
      state.account = action.payload
      state.status = ConnectionStatus.Connected
      store.set(STORE_ACCOUNT_KEY, action.payload)
    },
    setChainId: (state: ConnectionState, action: PayloadAction<number>) => {
      state.chainId = action.payload
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

export const { setAccount, setChainId, setConnecting, resetConnection } =
  connectionSlice.actions
export default connectionSlice.reducer

// Selectors
export function getStatus(state: RootState): ConnectionStatus {
  return state.connection.status
}
export function getAccount(state: RootState): string | null {
  return state.connection.account
}
export function getChainId(state: RootState): number | null {
  return state.connection.chainId
}
export const getIsConnected = createSelector([getStatus], (status) => {
  return status === ConnectionStatus.Connected
})
export const getIsValidNetwork = createSelector([getChainId], (chainId) => {
  return chainId === MAINNET
})
export const getShowNetworkAlert = createSelector([getChainId], (chainId) => {
  return chainId !== null && chainId !== MAINNET
})
export const getShowAlert = (getIsStakingPage: () => boolean) =>
  createSelector(
    [getShowNetworkAlert, getIsPriceInvalid, getIsStakingPage],
    (showNetworkAlert, showCoingeckoAlert, isStakingPage) => {
      return isStakingPage && (showNetworkAlert || showCoingeckoAlert)
    }
  )
