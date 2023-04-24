import { bnum } from './bnum'

export function calcTotalPoolValue(poolTokens: PoolToken[], prices: PriceMap) {
  const weights = poolTokens.map((token) => Number(token.weight))
  const totalWeight = weights.reduce(
    (total, weight) => total + Number(weight),
    0
  )
  let sumWeight = bnum(0)
  let sumValue = bnum(0)

  for (let i = 0; i < poolTokens.length; i++) {
    const token = poolTokens[i]
    const { address, balance = 0, weight = 0 } = token

    if (!prices[address]) {
      continue
    }

    const price = prices[address]
    const fiatValue = bnum(balance).times(price)

    sumValue = sumValue.plus(fiatValue)
    sumWeight = sumWeight.plus(weight)
  }

  if (sumWeight.gt(0)) {
    const liquidity = sumValue.dividedBy(sumWeight).times(totalWeight)
    return liquidity.toNumber()
  }

  return 0
}
