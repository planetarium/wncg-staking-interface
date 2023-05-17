import { bnum } from './bnum'
import { calcTotalPoolValue } from './calcTotalPoolValue'

export function getBptPrice(
  poolTokens: PoolToken[],
  bptTotalSupply: string,
  priceMap: PriceMap
) {
  let bptPrice: string

  try {
    bptPrice =
      bnum(calcTotalPoolValue(poolTokens, priceMap))
        .div(bptTotalSupply)
        .toString() ?? '0'
  } catch {
    bptPrice = '0'
  }

  return bptPrice
}
