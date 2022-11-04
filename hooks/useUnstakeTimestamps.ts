import { useMemo } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import type { BigNumber } from 'ethers'
import { useContractReads } from 'wagmi'
import { isPast } from 'date-fns'

import { stakingContractAddressAtom } from 'states/staking'
import { timestampsAtom } from 'states/user'
import { bnum } from 'utils/num'
import { networkChainId } from 'utils/network'
import { findAbiFromStaking } from 'utils/wagmi'
import { useAccount } from './useAccount'
import { useStakedBalance } from './useStakedBalance'

const FNS = ['getCooldownEndTimestamp', 'getWithdrawEndTimestamp']
const ABIS = findAbiFromStaking(...FNS)

export const UnstakeStatus = {
  NoCooldown: 'UNSTAKE_STATUS_NO_COOLDOWN',
  CooldownInProgress: 'UNSTAKE_STATUS_COOLDOWN_IN_PROGRESS',
  Withdrawable: 'UNSTAKE_STATUS_WITHDRAWABLE',
  NoStake: 'UNSTAKE_STATUS_NO_STAKE',
  NotConnected: 'UNSTAKE_STATUS_NOT_CONNECTED',
} as const
export type UnstakeStatus = typeof UnstakeStatus[keyof typeof UnstakeStatus]

export function useUnstakeTimestamps() {
  const { account, isConnected } = useAccount()
  const { stakedBalance } = useStakedBalance()

  const stakingAddress = useAtomValue(stakingContractAddressAtom)
  const [cooldownEndsAt, withdrawEndsAt] = useAtomValue(timestampsAtom)
  const setTimestamps = useSetAtom(timestampsAtom)

  const contracts = useMemo(
    () =>
      FNS.map((fn) => ({
        address: stakingAddress,
        abi: ABIS,
        functionName: fn,
        chainId: networkChainId,
        args: [account],
      })),
    [account, stakingAddress]
  )

  const { refetch } = useContractReads({
    contracts,
    enabled: !!account,
    onSuccess(data: unknown = []) {
      const timestamps = (data as BigNumber[]).map((timestamp) => {
        let timestampInMs = timestamp?.toNumber() * 1_000 || 0
        if (isPast(timestampInMs)) timestampInMs = 0
        return timestampInMs
      })
      setTimestamps(timestamps)
    },
  })

  const unstakeStatus = useMemo(() => {
    const now = Date.now()

    switch (true) {
      case !isConnected:
        return UnstakeStatus.NotConnected
      case now < withdrawEndsAt && cooldownEndsAt < now:
        return UnstakeStatus.Withdrawable
      case now < cooldownEndsAt:
        return UnstakeStatus.CooldownInProgress
      case bnum(stakedBalance).isZero():
        return UnstakeStatus.NoStake
      default:
        return UnstakeStatus.NoCooldown
    }
  }, [cooldownEndsAt, isConnected, stakedBalance, withdrawEndsAt])

  return {
    cooldownEndsAt,
    withdrawEndsAt,
    unstakeStatus,
    refetchTimestamps: refetch,
  }
}
