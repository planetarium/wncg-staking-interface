import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import store from 'store'
import type { RootState } from 'app/store'

export const TransactionAction = {
  Approve: 'Approve',
  ClaimAllRewards: 'ClaimAllRewards',
  ClaimBalRewards: 'ClaimBalRewards',
  ClaimWncgRewards: 'ClaimWncgRewards',
  EarmarkRewards: 'EarmarkRewards',
  Stake: 'Stake',
  StartCooldown: 'StartCooldown',
  Withdraw: 'Withdraw',
} as const
export type TransactionAction =
  typeof TransactionAction[keyof typeof TransactionAction]

export type Transaction = {
  hash: string
  summary: string
  action: TransactionAction
}

const STORE_TX_LIST_KEY = `wncgStaking.txList`

type TransactionState = {
  txList: Transaction[]
}

const INITIAL_STATE: TransactionState = {
  txList: store.get(STORE_TX_LIST_KEY) || [],
}

const transactionSlice = createSlice({
  name: '#transaction',
  initialState: INITIAL_STATE,
  reducers: {
    addTx(state: TransactionState, action: PayloadAction<Transaction>) {
      const storedTxList = store.get(STORE_TX_LIST_KEY) || []
      state.txList.push(action.payload)
      storedTxList.push(action.payload)

      store.set(STORE_TX_LIST_KEY, storedTxList)
    },
    removeTx(state: TransactionState, action: PayloadAction<string>) {
      const storedTxList = (store.get(STORE_TX_LIST_KEY) as Transaction[]) || []
      const matchIndex = state.txList.findIndex(
        (tx) => tx.hash === action.payload
      )
      if (matchIndex > -1) {
        state.txList.splice(matchIndex, 1)
        storedTxList.splice(matchIndex, 1)
      }

      store.set(STORE_TX_LIST_KEY, storedTxList)
    },
    resetTxList(state: TransactionState) {
      state.txList = []
      store.set(STORE_TX_LIST_KEY, [])
    },
  },
})

export const { addTx, removeTx, resetTxList } = transactionSlice.actions
export default transactionSlice.reducer

// Selector
export function getTxList(state: RootState) {
  return state.transaction.txList
}
