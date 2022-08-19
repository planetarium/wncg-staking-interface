import { useMemo } from 'react'
import { utils } from 'ethers'
import { hexZeroPad } from 'ethers/lib/utils'

import { getAccount } from 'app/states/connection'
import { getBptContractAddress } from 'app/states/contract'
import {
  BPT_POOL_ID,
  stakingContractAddress,
  vaultContractAddress,
} from 'utils/env'
import { wethAddress, wncgAddress } from 'utils/token'
import { useAppSelector } from './useRedux'

const approvalTopic = utils.id('Approval(address,address,uint256)')
const stakedTopic = utils.id('Staked(address,uint256)')
const cooldownTopic = utils.id('Cooldown(address)')
const withdrawnTopic = utils.id('Withdrawn(address,uint256)')
const rewardsAllTopic = utils.id('RewardsClaimedAll(address)')
const rewardsBalTopic = utils.id('RewardsClaimed_BAL(address,uint256)')
const rewardsWncgTopic = utils.id('RewardsClaimed_WNCG(address,uint256)')
const earmarkTopic = utils.id('EarmarkRewards(address,uint256)')
const feeUpdateTopic = utils.id('FeeUpdate()')
const poolBalanceChangedTopic = utils.id(
  'PoolBalanceChanged(bytes32,address,address[],int256[],uint256[])'
)

const filter = {
  address: stakingContractAddress,
}

export function useEventFilter() {
  const account = useAppSelector(getAccount)
  const bptAddress = useAppSelector(getBptContractAddress)

  const bptApprovalEventFilter = useMemo(() => {
    if (!account || !bptAddress) return null
    return {
      address: bptAddress,
      topics: [
        approvalTopic,
        hexZeroPad(account, 32),
        hexZeroPad(stakingContractAddress, 32),
      ],
    }
  }, [account, bptAddress])

  const wethApprovalEventFilter = useMemo(() => {
    if (!account) return null
    return {
      address: wethAddress,
      topics: [
        approvalTopic,
        hexZeroPad(account, 32),
        hexZeroPad(vaultContractAddress, 32),
      ],
    }
  }, [account])

  const wncgApprovalEventFilter = useMemo(() => {
    if (!account) return null
    return {
      address: wncgAddress,
      topics: [
        approvalTopic,
        hexZeroPad(account, 32),
        hexZeroPad(vaultContractAddress, 32),
      ],
    }
  }, [account])

  const stakedEventFilter = useMemo(() => {
    if (!account) return null
    return {
      ...filter,
      topics: [stakedTopic, hexZeroPad(account, 32)],
    }
  }, [account])

  const cooldownEventFilter = useMemo(() => {
    if (!account) return null
    return {
      ...filter,
      topics: [cooldownTopic, hexZeroPad(account, 32)],
    }
  }, [account])

  const withdrawnEventFilter = useMemo(() => {
    if (!account) return null
    return {
      ...filter,
      topics: [withdrawnTopic, hexZeroPad(account, 32)],
    }
  }, [account])

  const rewardsAllEventFilter = useMemo(() => {
    if (!account) return null
    return {
      ...filter,
      topics: [rewardsAllTopic, hexZeroPad(account, 32)],
    }
  }, [account])

  const rewardsBalEventFilter = useMemo(() => {
    if (!account) return null
    return {
      ...filter,
      topics: [rewardsBalTopic, hexZeroPad(account, 32)],
    }
  }, [account])

  const rewardsWncgEventFilter = useMemo(() => {
    if (!account) return null
    return {
      ...filter,
      topics: [rewardsWncgTopic, hexZeroPad(account, 32)],
    }
  }, [account])

  const earmarkEventFilter = useMemo(() => {
    if (!account) return null
    return {
      ...filter,
      topics: [earmarkTopic, hexZeroPad(account, 32)],
    }
  }, [account])

  const feeUpdateEventFilter = useMemo(
    () => ({
      ...filter,
      topics: [feeUpdateTopic],
    }),
    []
  )

  const poolBalanceChangedEventFilter = useMemo(() => {
    if (!account) return null
    return {
      address: vaultContractAddress,
      topics: [poolBalanceChangedTopic, BPT_POOL_ID, hexZeroPad(account, 32)],
    }
  }, [account])

  return {
    bptApprovalEventFilter,
    wethApprovalEventFilter,
    wncgApprovalEventFilter,
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
