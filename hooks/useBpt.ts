import { useCallback, useMemo } from 'react'
import { constants, Contract } from 'ethers'

import { setBalance, setIsApproved } from 'app/states/bpt'
import { getAccount, getIsValidNetwork } from 'app/states/connection'
import { getBptContractAddress } from 'app/states/contract'
import { setTotalBptSupply } from 'app/states/token'
import { addTx, TransactionAction } from 'app/states/transaction'
import { bptAbi } from 'lib/abis'
import { weiToEther } from 'utils/num'
import { useError } from './useError'
import { useProvider } from './useProvider'
import { useAppDispatch, useAppSelector } from './useRedux'
import { useToast } from './useToast'

export function useBpt() {
  const { handleError } = useError()
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
    return new Contract(bptAddress, bptAbi, provider.getSigner(account))
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
  }, [account, contract, dispatch, handleError])

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

  const balanceOf = useCallback(async () => {
    try {
      const balance = await contract?.balanceOf(account)
      if (balance) {
        dispatch(setBalance(weiToEther(balance)))
      }
    } catch (error) {
      handleError(error)
    }
  }, [account, contract, dispatch, handleError])

  const totalSupply = useCallback(async () => {
    try {
      const supply = await contract?.totalSupply()
      if (supply) {
        dispatch(setTotalBptSupply(weiToEther(supply)))
      }
    } catch (error) {
      handleError(error)
    }
  }, [contract, dispatch, handleError])

  return {
    allowance,
    approve,
    balanceOf,
    totalSupply,
  }
}
