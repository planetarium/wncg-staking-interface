import { useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import store from 'store'

import { getAccount, getIsConnected } from 'app/states/connection'
import {
  getCooldownEndTimestamp,
  getWithdrawEndTimestamp,
} from 'contracts/staking'
import {
  STORE_COOLDOWN_ENDS_AT,
  STORE_IS_UNSTAKE_WINDOW_KEY,
  STORE_WITHDRAW_ENDS_AT,
} from 'constants/storeKeys'
import { REFETCH_INTERVAL } from 'constants/time'
import { bnum } from 'utils/num'
import { useAppSelector } from './useRedux'
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
  const contract = useStakingContract(true)
  const { stakedBalance } = useStakedBalance()

  const account = useAppSelector(getAccount)
  const isConnected = useAppSelector(getIsConnected)

  const cooldownEndsAt = useQuery(
    ['cooldownEndsAt', account],
    () => getCooldownEndTimestamp(contract!, account),
    {
      enabled: !!contract,
      refetchInterval: REFETCH_INTERVAL,
      onSuccess(data) {
        if (bnum(data).gt(0)) {
          store.set(STORE_COOLDOWN_ENDS_AT, data)
        } else {
          store.remove(STORE_COOLDOWN_ENDS_AT)
        }
      },
    }
  )

  const withdrawEndsAt = useQuery(
    ['withdrawEndsAt', account],
    () => getWithdrawEndTimestamp(contract!, account),
    {
      enabled: !!contract,
      onSuccess(data) {
        if (bnum(data).gt(0)) {
          store.set(STORE_IS_UNSTAKE_WINDOW_KEY, true)
          store.set(STORE_WITHDRAW_ENDS_AT, data)
        } else {
          store.remove(STORE_IS_UNSTAKE_WINDOW_KEY)
          store.remove(STORE_WITHDRAW_ENDS_AT)
        }
      },
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
