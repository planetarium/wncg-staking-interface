import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from 'app/store'

type PoolState = {
  pool: Pool | null
}

const INITIAL_STATE: PoolState = {
  pool: null,
}

const poolSlice = createSlice({
  name: '#pool',
  initialState: INITIAL_STATE,
  reducers: {
    setPool(state: PoolState, action: PayloadAction<Pool>) {
      state.pool = action.payload
    },
  },
})

export const { setPool } = poolSlice.actions
export default poolSlice.reducer

// Selectors
export function getPool(state: RootState): Pool | null {
  return state.pool.pool
}
export function getPoolTokens(state: RootState): PoolToken[] {
  return state.pool.pool?.tokens || []
}
