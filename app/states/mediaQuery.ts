import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from 'app/store'

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

type MediaQueryState = {
  breakpoint: Breakpoint | null
}

const INITIAL_STATE: MediaQueryState = {
  breakpoint: null,
}

const mediaQuerySlice = createSlice({
  name: '#mediaQuery',
  initialState: INITIAL_STATE,
  reducers: {
    setBreakpoint(state: MediaQueryState, action: PayloadAction<Breakpoint>) {
      state.breakpoint = action.payload
    },
  },
})

export const { setBreakpoint } = mediaQuerySlice.actions
export default mediaQuerySlice.reducer

// Selectors
export function getBreakpoint(state: RootState) {
  return state.mediaQuery.breakpoint
}
export const getIsMobile = createSelector([getBreakpoint], (bp) =>
  ['xs', 'sm'].includes(bp || '')
)
export const getIsTablet = createSelector([getBreakpoint], (bp) => bp === 'md')
export const getIsDesktop = createSelector([getBreakpoint], (bp) =>
  ['lg', 'xl'].includes(bp || '')
)
