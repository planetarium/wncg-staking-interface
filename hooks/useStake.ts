import { useCallback, useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { Contract } from 'ethers'

import { getAccount } from 'app/states/connection'
import { networkMismatchState } from 'app/states/network'
import { configService } from 'services/config'
import { TransactionAction } from 'services/transaction'
import { stakeBpt } from 'contracts/staking'
import { StakingAbi } from 'lib/abi'
import { useAppDispatch, useAppSelector } from './useRedux'
import { useProvider } from './useProvider'
import { useTransaction } from './useTransaction'

export function useStake() {
  const provider = useProvider()
  const { transactionService } = useTransaction()

  const networkMismatch = useRecoilValue(networkMismatchState)
  const dispatch = useAppDispatch()
  const account = useAppSelector(getAccount)

  const contract = useMemo(() => {
    if (!provider || networkMismatch || !account) {
      return null
    }

    return new Contract(
      configService.stakingAddress,
      StakingAbi,
      provider.getSigner(account)
    )
  }, [account, networkMismatch, provider])

  const stake = useCallback(
    async (amount: string) => {
      if (!contract) return
      const response = await stakeBpt(contract, amount)
      transactionService?.registerTx(response, TransactionAction.Stake)
      return response.hash
    },
    [contract, transactionService]
  )

  return {
    stake,
  }
}
