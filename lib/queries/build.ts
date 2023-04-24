import config from 'config'
import { deserializePool } from 'utils/deserializePool'
import { prefetchPool } from './prefetchPool'
import { prefetchStaking } from './prefetchStaking'
import { prefetchTokens } from './prefetchTokens'

export async function build(): Promise<BuildResponse> {
  try {
    const poolResponse = await prefetchPool()
    const pool = deserializePool(poolResponse)

    const { rewardTokenAddresses, stakedTokenAddress, ...stakingData } =
      await prefetchStaking()

    const tokenMap = await prefetchTokens([
      ...rewardTokenAddresses,
      ...pool.poolTokenAddresses,
      stakedTokenAddress,
      config.weth,
    ])

    return {
      ...pool,
      ...stakingData,
      pool: poolResponse,
      rewardTokenAddresses,
      stakedTokenAddress,
      tokenMap,
    }
  } catch (error) {
    throw error
  }
}
