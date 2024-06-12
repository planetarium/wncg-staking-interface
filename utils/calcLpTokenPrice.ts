import { ChainId } from 'config/chains'
import { calcBalancerLpTokenPrice } from './calcBalancerLpTokenPrice'
import { calcPancakeSwapLpTokenPrice } from './calcPancakeSwapLpTokenPrice'
import { assertUnreachable } from './assertUnreachable'

export function calcLpTokenPrice(
  chainId: ChainId,
  poolTokens: PoolToken[],
  lpTokenAddress: Hash,
  lpTokenTotalSupply: string,
  priceMap: PriceMap
) {
  switch (chainId) {
    case ChainId.ETHEREUM:
    case ChainId.SEPOLIA:
      return calcBalancerLpTokenPrice(
        poolTokens,
        lpTokenAddress,
        lpTokenTotalSupply,
        priceMap
      )

    case ChainId.BSC:
    case ChainId.BSC_TESTNET:
      return calcPancakeSwapLpTokenPrice(
        chainId,
        poolTokens,
        lpTokenAddress,
        lpTokenTotalSupply,
        priceMap
      )

    default:
      assertUnreachable(chainId)
  }
}
