import { configureStore } from '@reduxjs/toolkit'

import balance from './states/balance'
import bpt from './states/bpt'
import connection from './states/connection'
import contract from './states/contract'
import mediaQuery from './states/mediaQuery'
import modal from './states/modal'
import pool from './states/pool'
import reward from './states/reward'
import stake from './states/stake'
import toast from './states/toast'
import token from './states/token'
import transaction from './states/transaction'
import unstake from './states/unstake'

export const store = configureStore({
  reducer: {
    balance,
    bpt,
    connection,
    contract,
    mediaQuery,
    modal,
    pool,
    reward,
    stake,
    toast,
    token,
    transaction,
    unstake,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
