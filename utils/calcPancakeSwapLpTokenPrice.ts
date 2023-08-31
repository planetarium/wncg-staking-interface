import { CHAINS } from 'config/chains'
import { bnum } from './bnum'

export function calcPancakeSwapLpTokenPrice(
  chainId: ChainId,
  poolTokens: PoolToken[],
  lpTokenAddress: Hash,
  lpTokenTotalSupply: string,
  priceMap: PriceMap
): PriceMap {
  if (poolTokens.every((t) => bnum(priceMap[t.address]).gt(0))) {
    return _calcWithPriceMap(
      poolTokens,
      lpTokenAddress,
      lpTokenTotalSupply,
      priceMap
    )
  }

  return _calcWithPoolRatio(
    chainId,
    poolTokens,
    lpTokenAddress,
    lpTokenTotalSupply,
    priceMap
  )
}

// NOTE: has all price data (from coingecko)
function _calcWithPriceMap(
  poolTokens: PoolToken[],
  lpTokenAddress: Hash,
  totalSupply: string,
  priceMap: PriceMap
) {
  const totalValue = poolTokens
    .reduce((acc, t) => {
      return acc.plus(bnum(t.balance).times(priceMap[t.address]))
    }, bnum(0))
    .toString()
  const lpTokenPrice = bnum(totalValue).div(totalSupply)

  return {
    [lpTokenAddress]: lpTokenPrice.isNaN() ? '0' : lpTokenPrice.toString(),
  }
}

// NOTE: has base token(=wrapped) price only
function _calcWithPoolRatio(
  chainId: ChainId,
  poolTokens: PoolToken[],
  lpTokenAddress: Hash,
  totalSupply: string,
  priceMap: PriceMap
) {
  const { nativeCurrency } = CHAINS[chainId]

  const pricingAssetIndex = poolTokens.findIndex(
    (t) => nativeCurrency.wrappedTokenAddress === t?.address
  )
  const pricingAssetPrice = priceMap[nativeCurrency.wrappedTokenAddress]
  const missingTokenIndex = 1 - pricingAssetIndex

  const totalValue = poolTokens
    .reduce((acc, t, i) => {
      if (i !== pricingAssetIndex) return acc
      return acc.plus(bnum(t.balance).times(pricingAssetPrice))
    }, bnum(0))
    .times(2)
    .toString()

  const lpTokenPrice = bnum(totalValue).div(totalSupply)
  const missingTokenPrice = bnum(totalValue)
    .div(2)
    .div(poolTokens[1 - pricingAssetIndex].balance)

  return {
    [lpTokenAddress]: lpTokenPrice.isNaN() ? '0' : lpTokenPrice.toString(),
    [poolTokens[missingTokenIndex].address]: missingTokenPrice.isNaN()
      ? '0'
      : missingTokenPrice.toString(),
  }
}
