import { bnum } from './bnum'
import { calcTotalPoolValue } from './calcTotalPoolValue'

export function calcBalancerLpTokenPrice(
  poolTokens: PoolToken[],
  lpTokenAddress: Hash,
  lpTokenTotalSupply: string,
  priceMap: PriceMap
): PriceMap {
  let price: string

  try {
    price =
      bnum(calcTotalPoolValue(poolTokens, priceMap))
        .div(lpTokenTotalSupply)
        .toString() ?? '0'
  } catch {
    price = '0'
  }

  return {
    [lpTokenAddress]: price,
  }
}
