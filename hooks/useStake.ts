import { useCallback } from 'react'

import { setTotalStaked } from 'app/states/bpt'
import { getAccount } from 'app/states/connection'
import { setBptAddress } from 'app/states/contract'
import { setStakedBalance } from 'app/states/stake'
import { addTx, TransactionAction } from 'app/states/transaction'
import { handleError } from 'utils/error'
import Decimal, { etherToWei, sanitizeNumber, weiToEther } from 'utils/num'
import { useContract } from './useContract'
import { useAppDispatch, useAppSelector } from './useRedux'
import { useToast } from './useToast'

export function useStake() {
  const contract = useContract()
  const { addToast } = useToast()

  const dispatch = useAppDispatch()
  const account = useAppSelector(getAccount)

  const stakedTokenBalance = useCallback(async () => {
    try {
      const stakedBalance = await contract?.stakedTokenBalance(account)
      if (stakedBalance) {
        dispatch(setStakedBalance(weiToEther(stakedBalance)))
      }
    } catch (error) {
      handleError(error)
    }
  }, [account, contract, dispatch])

  const stake = useCallback(
    async (amount: string) => {
      const data = await contract?.stake(etherToWei(sanitizeNumber(amount)))
      if (data) {
        const tx = {
          hash: data.hash,
          action: TransactionAction.Stake,
          summary: `Stake ${new Decimal(amount).toFixed(8)} 20WETH-80WNCG`,
        }
        dispatch(addTx(tx))
        addToast(tx, data.hash)
        return data.hash
      }
    },
    [addToast, contract, dispatch]
  )

  const stakedToken = useCallback(async () => {
    try {
      const address = await contract?.STAKED_TOKEN()
      if (address) {
        dispatch(setBptAddress(address))
      }
    } catch (error) {
      handleError(error)
    }
  }, [contract, dispatch])

  const totalStaked = useCallback(async () => {
    try {
      const balance = await contract?.totalStaked()
      if (balance) {
        dispatch(setTotalStaked(weiToEther(balance)))
      }
    } catch (error) {
      handleError(error)
    }
  }, [contract, dispatch])

  return {
    stake,
    stakedToken,
    stakedTokenBalance,
    totalStaked,
  }
}
