import { useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRecoilValue } from 'recoil'

import { connectedState, accountState } from 'app/states/connection'
import {
  getCooldownEndTimestamp,
  getWithdrawEndTimestamp,
} from 'contracts/staking'
import { REFETCH_INTERVAL } from 'constants/time'
import { bnum } from 'utils/num'
import { useStakedBalance } from './useStakedBalance'
import { useStakingContract } from './useStakingContract'

export const UnstakeStatus = {
  NoCooldown: 'UNSTAKE_STATUS_NO_COOLDOWN',
  CooldownInProgress: 'UNSTAKE_STATUS_COOLDOWN_IN_PROGRESS',
  Withdrawable: 'UNSTAKE_STATUS_WITHDRAWABLE',
  NoStake: 'UNSTAKE_STATUS_NO_STAKE',
  NotConnected: 'UNSTAKE_STATUS_NOT_CONNECTED',
} as const
export type UnstakeStatus = typeof UnstakeStatus[keyof typeof UnstakeStatus]

export function useUnstakeTimestamps() {
  const { contract, stakingAddress } = useStakingContract(true)
  const { stakedBalance } = useStakedBalance()

  const account = useRecoilValue(accountState)
  const isConnected = useRecoilValue(connectedState)

  const cooldownEndsAt = useQuery(
    ['cooldownEndsAt', account, stakingAddress],
    () => getCooldownEndTimestamp(contract!, account),
    {
      enabled: !!contract,
      refetchInterval: REFETCH_INTERVAL,
    }
  )

  const withdrawEndsAt = useQuery(
    ['withdrawEndsAt', account, stakingAddress],
    () => getWithdrawEndTimestamp(contract!, account),
    {
      enabled: !!contract,
    }
  )

  const unstakeStatus = useMemo(() => {
    const cooldownEndTimestamp = cooldownEndsAt.data || 0
    const withdrawEndTimestamp = withdrawEndsAt.data || 0
    const now = Date.now()

    switch (true) {
      case !isConnected:
        return UnstakeStatus.NotConnected
      case now < withdrawEndTimestamp && cooldownEndTimestamp < now:
        return UnstakeStatus.Withdrawable
      case now < cooldownEndTimestamp:
        return UnstakeStatus.CooldownInProgress
      case bnum(stakedBalance).isZero():
        return UnstakeStatus.NoStake
      default:
        return UnstakeStatus.NoCooldown
    }
  }, [cooldownEndsAt.data, isConnected, stakedBalance, withdrawEndsAt.data])

  const fetchTimestamps = useCallback(() => {
    cooldownEndsAt.refetch()
    withdrawEndsAt.refetch()
  }, [cooldownEndsAt, withdrawEndsAt])

  return {
    cooldownEndsAt: cooldownEndsAt.data || 0,
    withdrawEndsAt: withdrawEndsAt.data || 0,
    unstakeStatus,
    fetchTimestamps,
  }
}
