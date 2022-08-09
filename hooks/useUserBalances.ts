import { useCallback } from 'react'
import { formatUnits } from 'ethers/lib/utils'

import {
  setBptBalance,
  setEthBalance,
  setWethBalance,
  setWncgBalance,
} from 'app/states/balance'
import { getAccount } from 'app/states/connection'
import { IS_ETHEREUM } from 'utils/env'
import { handleError } from 'utils/error'
import { weiToEther } from 'utils/num'
import { useContracts } from './useContracts'
import { useProvider } from './useProvider'
import { useAppDispatch, useAppSelector } from './useRedux'

const WNCG_DECIMALS = IS_ETHEREUM ? 18 : 8

export function useUserBalances() {
  const { bptContract, wethContract, wncgContract } = useContracts()
  const provider = useProvider()

  const dispatch = useAppDispatch()
  const account = useAppSelector(getAccount)

  const fetchEthBalance = useCallback(async () => {
    try {
      const balance = await provider?.getBalance(account || '')
      if (balance) {
        dispatch(setEthBalance(weiToEther(balance.toString())))
      }
    } catch (error) {
      handleError(error)
    }
  }, [account, dispatch, provider])

  const fetchBptBalance = useCallback(async () => {
    try {
      const balance = await bptContract?.balanceOf(account)
      if (balance) {
        dispatch(setBptBalance(weiToEther(balance.toString())))
      }
    } catch (error) {
      handleError(error)
    }
  }, [account, bptContract, dispatch])

  const fetchWethBalance = useCallback(async () => {
    try {
      const balance = await wethContract?.balanceOf(account)
      if (balance) {
        dispatch(setWethBalance(weiToEther(balance.toString())))
      }
    } catch (error) {
      handleError(error)
    }
  }, [account, dispatch, wethContract])

  const fetchWncgBalance = useCallback(async () => {
    try {
      const balance = await wncgContract?.balanceOf(account)
      if (balance) {
        dispatch(setWncgBalance(formatUnits(balance, WNCG_DECIMALS).toString()))
      }
    } catch (error) {
      handleError(error)
    }
  }, [account, dispatch, wncgContract])

  return {
    fetchBptBalance,
    fetchEthBalance,
    fetchWethBalance,
    fetchWncgBalance,
  }
}
