import { EventFilter, utils } from 'ethers'
import { hexZeroPad } from 'ethers/lib/utils'

export const EventType = {
  Approval: 'EVENT_FILTER_APPROVAL',
  Staked: 'EVENT_FILTER_STAKED',
  Cooldown: 'EVENT_FILTER_COOLDOWN',
  Withdrawn: 'EVENT_FILTER_WITHDRAWN',
  RewardsAll: 'EVENT_FILTER_REWARDS_CLAIMED_ALL',
  RewardsBal: 'EVENT_FILTER_REWARDS_CLAIMED_BAL',
  RewardsWncg: 'EVENT_FILTER_REWARDS_CLAIMED_WNCG',
  EarmarkRewards: 'EVENT_FILTER_EARMARK_REWARDS',
  FeeUpdate: 'EVENT_FILTER_FEE_UPDATE',
  PoolBalanceChanged: 'EVENT_FILTER_POOL_BALANCE_CHANGED',
} as const
export type EventType = typeof EventType[keyof typeof EventType]

export function createApprovalEventFilter(
  account: string | null,
  address?: string,
  spender?: string
): EventFilter | null {
  if (!account || !address || !spender) return null

  return {
    address,
    topics: [
      utils.id('Approval(address,address,uint256)'),
      hexZeroPad(account, 32),
      hexZeroPad(spender, 32),
    ],
  }
}
