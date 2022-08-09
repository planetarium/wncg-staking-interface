import { useMemo } from 'react'
import { Contract } from 'ethers'

import { getAccount, getIsValidNetwork } from 'app/states/connection'
import { getBptContractAddress } from 'app/states/contract'
import { tokenAbi } from 'lib/abis'
import { wethAddress, wncgAddress } from 'utils/token'
import { useProvider } from './useProvider'
import { useAppSelector } from './useRedux'

export function useContracts() {
  const isValidNetwork = useAppSelector(getIsValidNetwork)

  const account = useAppSelector(getAccount)
  const bptAddress = useAppSelector(getBptContractAddress)
  const provider = useProvider()

  const bptContract = useMemo(() => {
    if (!provider || !isValidNetwork || !account) return null
    return new Contract(bptAddress, tokenAbi, provider.getSigner(account))
  }, [account, bptAddress, isValidNetwork, provider])

  const wethContract = useMemo(() => {
    if (!provider || !isValidNetwork || !account) return null
    return new Contract(wethAddress, tokenAbi, provider.getSigner(account))
  }, [account, isValidNetwork, provider])

  const wncgContract = useMemo(() => {
    if (!provider || !isValidNetwork || !account) return null
    return new Contract(wncgAddress, tokenAbi, provider.getSigner(account))
  }, [account, isValidNetwork, provider])

  return {
    bptContract,
    wethContract,
    wncgContract,
  }
}
