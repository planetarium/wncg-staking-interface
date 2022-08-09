import { useCallback, useMemo } from 'react'
import { constants, Contract } from 'ethers'

import { setIsApproved } from 'app/states/bpt'
import { getAccount, getIsValidNetwork } from 'app/states/connection'
import { getBptContractAddress } from 'app/states/contract'
import { addTx, TransactionAction } from 'app/states/transaction'
import { tokenAbi } from 'lib/abis'
import { handleError } from 'utils/error'
import { useProvider } from './useProvider'
import { useAppDispatch, useAppSelector } from './useRedux'
import { useToast } from './useToast'

export function useBpt() {
  const provider = useProvider()
  const { addToast } = useToast()

  const dispatch = useAppDispatch()
  const account = useAppSelector(getAccount)
  const bptAddress = useAppSelector(getBptContractAddress)
  const isValidNetwork = useAppSelector(getIsValidNetwork)

  const contract = useMemo(() => {
    if (!provider || !isValidNetwork || !bptAddress || !account) {
      return null
    }
    return new Contract(bptAddress, tokenAbi, provider.getSigner(account))
  }, [account, bptAddress, isValidNetwork, provider])

  const allowance = useCallback(async () => {
    try {
      const approvedAmount = await contract?.allowance(
        account,
        process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS as string
      )

      if (!approvedAmount) {
        dispatch(setIsApproved(false))
        return
      }

      if (approvedAmount.isZero()) {
        dispatch(setIsApproved(false))
      } else {
        dispatch(setIsApproved(true))
      }
    } catch (error) {
      handleError(error)
    }
  }, [account, contract, dispatch])

  const approve = useCallback(async () => {
    const data = await contract?.approve(
      process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS as string,
      constants.MaxUint256
    )
    if (data) {
      const tx = {
        hash: data.hash,
        action: TransactionAction.Approve,
        summary: 'Approving 20WETH-80WNCG',
      }
      dispatch(addTx(tx))
      addToast(tx, data.hash)
    }
  }, [addToast, contract, dispatch])

  return {
    allowance,
    approve,
  }
}
