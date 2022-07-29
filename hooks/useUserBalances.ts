import { useCallback, useEffect, useMemo } from 'react'
import { Contract } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'

import {
  setBptBalance,
  setEthBalance,
  setWethBalance,
  setWncgBalance,
} from 'app/states/balance'
import { getAccount, getIsValidNetwork } from 'app/states/connection'
import { getBptContractAddress } from 'app/states/contract'
import { tokenAbi } from 'lib/abis'
import { IS_ETHEREUM } from 'utils/env'
import { handleError } from 'utils/error'
import { weiToEther } from 'utils/num'
import { wethAddress, wncgAddress } from 'utils/token'
import { useProvider } from './useProvider'
import { useAppDispatch, useAppSelector } from './useRedux'

const WNCG_DECIMALS = IS_ETHEREUM ? 18 : 8

export function useUserBalances() {
  const dispatch = useAppDispatch()
  const isValidNetwork = useAppSelector(getIsValidNetwork)

  const bptAddress = useAppSelector(getBptContractAddress)
  const provider = useProvider()
  const account = useAppSelector(getAccount)

  const fetchEthBalance = useCallback(async () => {
    try {
      const balance = await provider?.getBalance(account || '')

      if (balance) {
        console.log('eth', weiToEther(balance.toString()))
        dispatch(setEthBalance(weiToEther(balance.toString())))
      }
    } catch (error) {
      handleError(error)
    }
  }, [account, dispatch, provider])

  const bptContract = useMemo(() => {
    if (!provider || !isValidNetwork || !account) return null
    return new Contract(bptAddress, tokenAbi, provider.getSigner(account))
  }, [account, bptAddress, isValidNetwork, provider])

  const fetchBptBalance = useCallback(async () => {
    try {
      const balance = await bptContract?.balanceOf(account)
      if (balance) {
        console.log('bpt', weiToEther(balance.toString()))
        dispatch(setBptBalance(weiToEther(balance.toString())))
      }
    } catch (error) {
      handleError(error)
    }
  }, [account, bptContract, dispatch])

  const wethContract = useMemo(() => {
    if (!provider || !isValidNetwork || !account) return null
    return new Contract(wethAddress, tokenAbi, provider.getSigner(account))
  }, [account, isValidNetwork, provider])

  const fetchWethBalance = useCallback(async () => {
    try {
      const balance = await wethContract?.balanceOf(account)
      if (balance) {
        console.log('weth', weiToEther(balance.toString()))
        dispatch(setWethBalance(weiToEther(balance.toString())))
      }
    } catch (error) {
      handleError(error)
    }
  }, [account, dispatch, wethContract])

  const wncgContract = useMemo(() => {
    if (!provider || !isValidNetwork || !account) return null
    return new Contract(wncgAddress, tokenAbi, provider.getSigner(account))
  }, [account, isValidNetwork, provider])

  const fetchWncgBalance = useCallback(async () => {
    try {
      const balance = await wncgContract?.balanceOf(account)
      if (balance) {
        console.log('wncg', formatUnits(balance, WNCG_DECIMALS).toString())
        dispatch(setWncgBalance(formatUnits(balance, WNCG_DECIMALS).toString()))
      }
    } catch (error) {
      handleError(error)
    }
  }, [account, dispatch, wncgContract])

  useEffect(() => {
    fetchEthBalance()
  }, [fetchEthBalance])

  useEffect(() => {
    fetchBptBalance()
  }, [fetchBptBalance])

  useEffect(() => {
    fetchWethBalance()
  }, [fetchWethBalance])

  useEffect(() => {
    fetchWncgBalance()
  }, [fetchWncgBalance])
}
