import { useCallback, useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { utils } from 'ethers'
import { hexZeroPad } from 'ethers/lib/utils'
import { useAccount } from 'wagmi'

import { stakingContractAddressState } from 'app/states/settings'
import { configService } from 'services/config'

export function useEvents() {
  const { address: account } = useAccount()
  const stakingAddress = useRecoilValue(stakingContractAddressState)

  const createApprovalEvent = useCallback(
    (address?: string, spender?: string) => {
      if (!account || !address || !spender) return null

      return {
        address,
        topics: [
          utils.id('Approval(address,address,uint256)'),
          hexZeroPad(account, 32),
          hexZeroPad(spender, 32),
        ],
      }
    },
    [account]
  )

  const stakedEvent = useMemo(() => {
    if (!account) return null
    return {
      address: stakingAddress,
      topics: [utils.id('Staked(address,uint256)'), hexZeroPad(account, 32)],
    }
  }, [account, stakingAddress])

  const cooldownEvent = useMemo(() => {
    if (!account) return null
    return {
      address: stakingAddress,
      topics: [utils.id('Cooldown(address)'), hexZeroPad(account, 32)],
    }
  }, [account, stakingAddress])

  const withdrawnEvent = useMemo(() => {
    if (!account) return null
    return {
      address: stakingAddress,
      topics: [utils.id('Withdrawn(address,uint256)'), hexZeroPad(account, 32)],
    }
  }, [account, stakingAddress])

  const rewardsClaimedAllEvent = useMemo(() => {
    if (!account) return null
    return {
      address: stakingAddress,
      topics: [utils.id('RewardsClaimedAll(address)'), hexZeroPad(account, 32)],
    }
  }, [account, stakingAddress])

  const rewardsClaimedBalEvent = useMemo(() => {
    if (!account) return null
    return {
      address: stakingAddress,
      topics: [
        utils.id('RewardsClaimed_BAL(address,uint256)'),
        hexZeroPad(account, 32),
      ],
    }
  }, [account, stakingAddress])

  const rewardsClaimedWncgEvent = useMemo(() => {
    if (!account) return null
    return {
      address: stakingAddress,
      topics: [
        utils.id('RewardsClaimed_WNCG(address,uint256)'),
        hexZeroPad(account, 32),
      ],
    }
  }, [account, stakingAddress])

  const earmarkRewardsEvent = useMemo(() => {
    if (!account) return null
    return {
      address: stakingAddress,
      topics: [
        utils.id('EarmarkRewards(address,uint256)'),
        hexZeroPad(account, 32),
      ],
    }
  }, [account, stakingAddress])

  const feeUpdateEvent = useMemo(
    () => ({
      address: stakingAddress,
      topics: [utils.id('FeeUpdate()')],
    }),
    []
  )

  const poolBalanceChangedEvent = useMemo(() => {
    if (!account) return null
    return {
      address: configService.vaultAddress,
      topics: [
        utils.id(
          'PoolBalanceChanged(bytes32,address,address[],int256[],uint256[])'
        ),
        configService.poolId,
        hexZeroPad(account, 32),
      ],
    }
  }, [account])

  return {
    createApprovalEvent,
    stakedEvent,
    cooldownEvent,
    withdrawnEvent,
    rewardsClaimedAllEvent,
    rewardsClaimedBalEvent,
    rewardsClaimedWncgEvent,
    earmarkRewardsEvent,
    feeUpdateEvent,
    poolBalanceChangedEvent,
  }
}
