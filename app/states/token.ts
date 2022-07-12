import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from 'app/store'
import Decimal, { sanitizeNumber } from 'utils/num'

type TokenState = {
  balPrice: number | null
  wethPrice: number | null
  wncgPrice: number | null
  totalBptSupply: string | null
  totalWethSupply: string | null
  totalWncgSupply: string | null
}

const INITIAL_STATE: TokenState = {
  balPrice: null,
  wethPrice: null,
  wncgPrice: null,
  totalBptSupply: null,
  totalWethSupply: null,
  totalWncgSupply: null,
}

const tokenSlice = createSlice({
  name: '#token',
  initialState: INITIAL_STATE,
  reducers: {
    setBalPrice(state: TokenState, action: PayloadAction<number | null>) {
      state.balPrice = action.payload
    },
    setWethPrice(state: TokenState, action: PayloadAction<number | null>) {
      state.wethPrice = action.payload
    },
    setWncgPrice(state: TokenState, action: PayloadAction<number | null>) {
      state.wncgPrice = action.payload
    },
    setTotalBptSupply(state: TokenState, action: PayloadAction<string | null>) {
      state.totalBptSupply = action.payload
    },
    setTotalWethSupply(
      state: TokenState,
      action: PayloadAction<string | null>
    ) {
      state.totalWethSupply = action.payload
    },
    setTotalWncgSupply(
      state: TokenState,
      action: PayloadAction<string | null>
    ) {
      state.totalWncgSupply = action.payload
    },
  },
})

export const {
  setBalPrice,
  setWethPrice,
  setWncgPrice,
  setTotalBptSupply,
  setTotalWethSupply,
  setTotalWncgSupply,
} = tokenSlice.actions
export default tokenSlice.reducer

// Selectors
export function getBalPrice(state: RootState): number {
  return state.token.balPrice || 0
}
export function getWethPrice(state: RootState): number {
  return state.token.wethPrice || 0
}
export function getWncgPrice(state: RootState): number {
  return state.token.wncgPrice || 0
}
export function getTotalBptSupply(state: RootState): string {
  return state.token.totalBptSupply || '0'
}
export function getTotalWethSupply(state: RootState): string {
  return state.token.totalWethSupply || '0'
}
export function getTotalWncgSupply(state: RootState): string {
  return state.token.totalWncgSupply || '0'
}

export const getTotalPoolValue = createSelector(
  [getTotalWethSupply, getWethPrice, getTotalWncgSupply, getWncgPrice],
  (wethSupply, wethPrice, wncgSupply, wncgPrice) => {
    const totalWethValue = new Decimal(sanitizeNumber(wethSupply)).mul(
      wethPrice
    )
    const totalWncgValue = new Decimal(sanitizeNumber(wncgSupply)).mul(
      wncgPrice
    )
    return totalWethValue.plus(totalWncgValue).toNumber()
  }
)
export const getBptPrice = createSelector(
  [getTotalPoolValue, getTotalBptSupply],
  (totalValue, totalSupply) => {
    if (new Decimal(totalValue).isZero() || new Decimal(totalSupply).isZero()) {
      return 0
    }
    return new Decimal(totalValue).div(totalSupply).toNumber()
  }
)
export const getIsPriceInvalid = createSelector(
  [getBalPrice, getWethPrice, getWncgPrice],
  (balPrice, wethPrice, wncgPrice) => {
    const bal = new Decimal(balPrice)
    const weth = new Decimal(wethPrice)
    const wncg = new Decimal(wncgPrice)

    return bal.isZero() && weth.isZero() && wncg.isZero()
  }
)
