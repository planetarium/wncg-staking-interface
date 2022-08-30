import { useCallback, useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { Contract } from 'ethers'

import { getAccount } from 'app/states/connection'

import { networkMismatchState } from 'app/states/network'

import { TransactionAction } from 'services/transaction'

import { useFee } from './useFee'
import { useProvider } from './useProvider'
import { useStakingContract } from './useStakingContract'
import { useAppDispatch, useAppSelector } from './useRedux'
import { useToast } from './useToast'

export function useReward() {
  const { earmarkIncentiveFee, feeDenominator } = useFee()
  const provider = useProvider()
  // FIXME: needs 2 contracts: signer/provider
  const contract = useStakingContract(true)
  const { addToast } = useToast()

  const dispatch = useAppDispatch()

  const earmarkRewards = useCallback(async () => {
    const data = await contract?.earmarkRewards()
    if (data) {
      const tx = {
        hash: data.hash,
        action: TransactionAction.EarmarkRewards,
        summary: 'Harvest BAL reward',
      }
      // dispatch(addTx(tx))
      // addToast(tx, data.hash)
    }
  }, [addToast, contract, dispatch])

  return {
    earmarkRewards,
  }
}
