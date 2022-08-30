import { isSameAddress, WeightedPoolEncoder } from '@balancer-labs/sdk'
import { getAddress, parseUnits } from 'ethers/lib/utils'

import { bnum } from 'utils/num'
import { configService } from './config'

type BuildJoinRequestParams = {
  isNativeAsset: boolean
  amounts: string[]
  minBptOut: string
}

export default class PoolService {
  poolId: string
  endpoint: string
  itemsPerPage: number

  constructor(
    public readonly pool?: Pool,
    public readonly config = configService
  ) {
    this.endpoint = this.config.subgraph
    this.poolId = this.config.poolId
    this.itemsPerPage = 5
  }

  calcPoolTotalValue(prices: TokenPrices) {
    const weights = this.poolTokens.map((token) => Number(token.weight))
    const totalWeight = weights.reduce(
      (total, weight) => total + Number(weight),
      0
    )
    let sumWeight = bnum(0)
    let sumValue = bnum(0)

    for (let i = 0; i < this.poolTokens.length; i++) {
      const token = this.poolTokens[i]
      const address = getAddress(token.address).toLowerCase()

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

  bptPrice(prices?: TokenPrices) {
    if (!this.pool || !prices) return '0'

    return bnum(this.calcPoolTotalValue(prices))
      .div(this.pool.totalShares)
      .toString()
  }

  buildJoinPoolRequest({
    isNativeAsset,
    amounts,
    minBptOut,
  }: BuildJoinRequestParams): JoinPoolRequest {
    const assets = this.poolTokenAddresses.map((address) => {
      if (isSameAddress(address, this.config.weth) && isNativeAsset) {
        return this.config.zeroAddress
      }
      return address
    })
    const maxAmountsIn = amounts.map((amount, i) =>
      parseUnits(amount, this.poolTokenDecimals[i]).toString()
    )
    const userData = WeightedPoolEncoder.joinExactTokensInForBPTOut(
      maxAmountsIn,
      minBptOut
    )

    return {
      assets,
      maxAmountsIn,
      userData,
      fromInternalBalance: false,
    }
  }

  get bptAddress() {
    return this.pool?.address || ''
  }

  get poolTokens() {
    return this.pool?.tokens || []
  }

  get poolTokenBalances() {
    return this.poolTokens.map((token) => token.balance)
  }

  get poolTokenDecimals() {
    return this.poolTokens.map((token) => token.decimals)
  }

  get poolTokenAddresses() {
    return this.pool?.tokensList.map((address) => address.toLowerCase()) || []
  }

  get nativeAssetIndex() {
    return this.poolTokenAddresses.findIndex((address) =>
      isSameAddress(address, configService.weth)
    )
  }
}
