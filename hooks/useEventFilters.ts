import { useMemo } from 'react'
import { utils } from 'ethers'
import { hexZeroPad } from 'ethers/lib/utils'

import { getAccount } from 'app/states/connection'
import { configService } from 'services/config'
import { usePoolService } from './usePoolService'
import { useAppSelector } from './useRedux'

export function useEventFilters() {
  const account = useAppSelector(getAccount)

  const stakedEventFilter = useMemo(() => {
    if (!account) return null
    return {
      address: configService.stakingAddress,
      topics: [utils.id('Staked(address,uint256)'), hexZeroPad(account, 32)],
    }
  }, [account])

  const cooldownEventFilter = useMemo(() => {
    if (!account) return null
    return {
      address: configService.stakingAddress,
      topics: [utils.id('Cooldown(address)'), hexZeroPad(account, 32)],
    }
  }, [account])

  const withdrawnEventFilter = useMemo(() => {
    if (!account) return null
    return {
      address: configService.stakingAddress,
      topics: [utils.id('Withdrawn(address,uint256)'), hexZeroPad(account, 32)],
    }
  }, [account])

  const rewardsAllEventFilter = useMemo(() => {
    if (!account) return null
    return {
      address: configService.stakingAddress,
      topics: [utils.id('RewardsClaimedAll(address)'), hexZeroPad(account, 32)],
    }
  }, [account])

  const rewardsBalEventFilter = useMemo(() => {
    if (!account) return null
    return {
      address: configService.stakingAddress,
      topics: [
        utils.id('RewardsClaimed_BAL(address,uint256)'),
        hexZeroPad(account, 32),
      ],
    }
  }, [account])

  const rewardsWncgEventFilter = useMemo(() => {
    if (!account) return null
    return {
      address: configService.stakingAddress,
      topics: [
        utils.id('RewardsClaimed_WNCG(address,uint256)'),
        hexZeroPad(account, 32),
      ],
    }
  }, [account])

  const earmarkEventFilter = useMemo(() => {
    if (!account) return null
    return {
      address: configService.stakingAddress,
      topics: [
        utils.id('EarmarkRewards(address,uint256)'),
        hexZeroPad(account, 32),
      ],
    }
  }, [account])

  const feeUpdateEventFilter = useMemo(
    () => ({
      address: configService.stakingAddress,
      topics: [utils.id('FeeUpdate()')],
    }),
    []
  )

  const poolBalanceChangedEventFilter = useMemo(() => {
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
    stakedEventFilter,
    cooldownEventFilter,
    withdrawnEventFilter,
    rewardsAllEventFilter,
    rewardsBalEventFilter,
    rewardsWncgEventFilter,
    earmarkEventFilter,
    feeUpdateEventFilter,
    poolBalanceChangedEventFilter,
  }
}
