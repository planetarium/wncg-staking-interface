import { useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRecoilValue } from 'recoil'
import { Contract } from 'ethers'

import { getAccount } from 'app/states/connection'
import { networkMismatchState } from 'app/states/network'
import {
  getCooldownEndTimestamp,
  getWithdrawEndTimestamp,
  initCooldown,
  unstakeBpt,
} from 'contracts/staking'
import { configService } from 'services/config'
import { TransactionAction } from 'services/transaction'
import { useAppSelector } from './useRedux'
import { useTransaction } from './useTransaction'
import { useProvider } from './useProvider'

import { StakingAbi } from 'lib/abi'

export function useUnstake() {
  // FIXME: needs 2 contracts: signer/provider
  const { transactionService } = useTransaction()

  const provider = useProvider()

  const networkMismatch = useRecoilValue(networkMismatchState)
  const account = useAppSelector(getAccount)

  const contract = useMemo(() => {
    if (!provider || networkMismatch || !account) return null
    return new Contract(
      configService.stakingAddress,
      StakingAbi,
      provider.getSigner(account)
    )
  }, [account, networkMismatch, provider])

  const cooldownEndsAt = useQuery(
    ['cooldownEndsAt', account],
    () => getCooldownEndTimestamp(contract!, account),
    {
      enabled: !!contract,
    }
  )

  const withdrawEndsAt = useQuery(
    ['withdrawEndsAt', account],
    () => getWithdrawEndTimestamp(contract!, account),
    {
      enabled: !!contract,
    }
  )

  const fetchTimestamps = useCallback(() => {
    cooldownEndsAt.refetch()
    withdrawEndsAt.refetch()
  }, [cooldownEndsAt, withdrawEndsAt])

  const startCooldown = useCallback(async () => {
    if (!contract) return
    const response = await initCooldown(contract)
    transactionService?.registerTx(response, TransactionAction.StartCooldown)
  }, [contract, transactionService])

  const withdraw = useCallback(
    async (amount: string, isClaimAllRewards: boolean) => {
      if (!contract) return
      const response = await unstakeBpt(contract, amount, isClaimAllRewards)
      const action = isClaimAllRewards
        ? TransactionAction.WithdrawAndClaim
        : TransactionAction.Withdraw
      transactionService?.registerTx(response, action)
    },
    [contract, transactionService]
  )

  return {
    cooldownEndsAt: cooldownEndsAt.data || 0,
    withdrawEndsAt: withdrawEndsAt.data || 0,
    startCooldown,
    withdraw,
    fetchTimestamps,
  }
}
