import { YEAR_IN_SEC } from 'constants/time'
import { bnum } from './num'

export function calcApr(
  emissionRate: string,
  price: number | string,
  totalStakedValue: number
) {
  const apr = bnum(emissionRate)
    .times(price)
    .times(YEAR_IN_SEC)
    .div(totalStakedValue)
    .times(100)

  const isValid = !apr.isNaN() && apr.isFinite()
  return isValid ? apr.toNumber() : 0
}

export function calcPoolTotalValue(
  poolTokens: PoolToken[],
  prices: TokenPrices
) {
  const weights = poolTokens.map((token) => Number(token.weight))
  const totalWeight = weights.reduce(
    (total, weight) => total + Number(weight),
    0
  )
  let sumWeight = bnum(0)
  let sumValue = bnum(0)

  for (let i = 0; i < poolTokens.length; i++) {
    const token = poolTokens[i]
    const address = token.address.toLowerCase()

    if (!prices[address]) {
      continue
    }

    const price = prices[address]
    const balance = token.balance

    const value = bnum(balance).times(price)
    const weight = token.weight ? token.weight : 0

    sumValue = sumValue.plus(value)
    sumWeight = sumWeight.plus(weight)
  }

  if (sumWeight.gt(0)) {
    const liquidity = sumValue.dividedBy(sumWeight).times(totalWeight)
    return liquidity.toNumber()
  }

  return 0
}
