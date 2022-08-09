import { atom, selector } from 'recoil'

import Decimal, { sanitizeNumber } from 'utils/num'

export const poolState = atom<Pool | null>({
  key: '#pool',
  default: null,
})

export const poolTokenPricesState = atom<number[] | null>({
  key: '#poolTokenPrices',
  default: null,
})

export const poolTotalSharesState = selector({
  key: '#poolTotalShares',
  get({ get }) {
    const pool = get(poolState)
    return pool?.totalShares || '0'
  },
})

export const poolTokensState = selector<PoolToken[]>({
  key: '#poolTokens',
  get({ get }) {
    const pool = get(poolState)
    return pool?.tokens || []
  },
})

export const poolTotalValueState = selector({
  key: '#poolTotalValue',
  get({ get }) {
    const pool = get(poolState)
    const prices = get(poolTokenPricesState) || []
    if (!pool || !prices) return 0

    const poolTokenBalances = pool.tokens.map((t) => t.balance)
    return poolTokenBalances.reduce((acc, balance, i) => {
      acc += new Decimal(sanitizeNumber(balance))
        .mul(sanitizeNumber(prices[i]))
        .toNumber()
      return acc
    }, 0)
  },
})

export const poolTokenPriceState = selector({
  key: '#poolTokenPrice',
  get({ get }) {
    const totalValue = get(poolTotalValueState)
    const totalShares = get(poolTotalSharesState)

    const price = new Decimal(totalValue).div(totalShares)

    if (price.isNaN() || !price.isFinite()) return 0
    return price.toNumber()
  },
})
