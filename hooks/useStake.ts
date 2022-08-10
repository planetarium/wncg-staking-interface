import { useCallback } from 'react'

import { getAccount } from 'app/states/connection'
import { setBptAddress } from 'app/states/contract'
import { setStakedBalance, setTotalStaked } from 'app/states/stake'
import { addTx, TransactionAction } from 'app/states/transaction'
import { handleError } from 'utils/error'
import Decimal, { etherToWei, sanitizeNumber, weiToEther } from 'utils/num'
import { useAppDispatch, useAppSelector } from './useRedux'
import { useStakingContract } from './useStakingContract'
import { useToast } from './useToast'

export function useStake() {
  const contract = useStakingContract()
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

  const stakedTokenAddress = useCallback(async () => {
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
    stakedTokenAddress,
    stakedTokenBalance,
    totalStaked,
  }
}
