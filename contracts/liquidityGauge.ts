import type { Contract } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'

import { configService } from 'services/config'
import { createLogger } from 'utils/log'

const logger = createLogger('yellow')

export async function getClaimableTokens(
  contract: Contract | null
): Promise<string> {
  const key = 'earmark incentive'
  try {
    logger(key)
    const data = await contract?.claimable_tokens(configService.stakingAddress)
    return data ? formatUnits(data, 18) : '0'
  } catch (error) {
    logger(key, error)
    throw error
  }
}
