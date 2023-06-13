import { CHAINS, ChainId } from 'config/chains'
import { calcBalancerLpTokenPrice } from 'utils/calcBalancerLpTokenPrice'
import { calcPancakeSwapLpTokenPrice } from 'utils/calcPancakeSwapLpTokenPrice'
import { uniqAddress } from 'utils/uniqAddress'
import { prefetchPool } from './prefetchPool'
import { prefetchStaking } from './prefetchStaking'
import { fetchPrices } from './fetchPrices'
import { prefetchTokens } from './prefetchTokens'

export async function build(chainId: ChainId) {
  console.log('Building >>> ', chainId)
  chainId = Math.max(Number(chainId), ChainId.ETHEREUM) as ChainId

  try {
    const pool = await prefetchPool(chainId)
    const staking = await prefetchStaking(chainId)

    const tokenList = uniqAddress([
      ...pool.poolTokenAddresses,
      ...staking.rewardTokenAddresses,
    ])

    const _tokens = await prefetchTokens(chainId, tokenList)
    const tokens = {
      ..._tokens,
      [pool.lpToken.address]: pool.lpToken,
    }
    const basePriceMap = await fetchPrices(chainId, tokenList)

    let priceMap: PriceMap = {}

    if (CHAINS[chainId].assetPlatform === 'ethereum') {
      priceMap = {
        ...basePriceMap,
        ...calcBalancerLpTokenPrice(
          pool.poolTokens,
          pool.lpToken.address,
          pool.lpToken.totalSupply,
          basePriceMap
        ),
      }
    }

    if (CHAINS[chainId].assetPlatform === 'binance-smart-chain') {
      priceMap = {
        ...basePriceMap,
        ...calcPancakeSwapLpTokenPrice(
          chainId,
          pool.poolTokens,
          pool.lpToken.address,
          pool.lpToken.totalSupply,
          basePriceMap
        ),
      }
    }

    return {
      pool,
      staking,
      tokens,
      priceMap,
    }
  } catch (error) {
    // TODO: 이거 전체 적용
    if (process.env.NODE_ENV === 'production') {
      console.error('Error when fetching tvl stats', error)
      // return {
      //   pool: LIQUIDITY_POOL_PLACEHOLDER,
      //   staking: STAKING_PLACEHOLDER[chainId],
      //   tokens: TOKENS[chainId],
      //   priceMap: {},
      // } satisfies {
      //   pool: LiquidityPool
      //   staking: Staking | EthereumStaking
      //   tokens: TokenMap
      //   priceMap: PriceMap
      // }
    } else {
      throw error
    }
  }
}
