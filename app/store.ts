import { configureStore } from '@reduxjs/toolkit'

import connection from './states/connection'
import mediaQuery from './states/mediaQuery'
import modal from './states/modal'
import toast from './states/toast'

export const store = configureStore({
  reducer: {
    connection,
    mediaQuery,
    modal,
    toast,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
