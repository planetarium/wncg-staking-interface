import { isSameAddress } from '@balancer-labs/sdk'

import { configService } from './config'

type BuildJoinRequestParams = {
  isNativeAsset: boolean
  amounts: string[]
  minBptOut: string
}

export class JoinExitService {
  constructor(
    public readonly pool: Pool,
    public readonly config = configService
  ) {}

  buildJoinPoolRequest({
    isNativeAsset,
    amounts,
    minBptOut,
  }: BuildJoinRequestParams): JoinPoolRequest {
    const assets = this.pool.tokensList.map((address) => {
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
}
