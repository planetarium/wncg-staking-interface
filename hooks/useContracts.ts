import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { Contract } from 'ethers'

import { getAccount } from 'app/states/connection'
import { getBptContractAddress } from 'app/states/contract'
import { networkMismatchState } from 'app/states/network'
import { Erc20Abi } from 'lib/abi'
import { wethAddress, wncgAddress } from 'utils/token'
import { useProvider } from './useProvider'
import { useAppSelector } from './useRedux'

export function useContracts() {
  const provider = useProvider()

  const networkMismatch = useRecoilValue(networkMismatchState)
  const account = useAppSelector(getAccount)
  const bptAddress = useAppSelector(getBptContractAddress)

  const bptContract = useMemo(() => {
    if (!provider || networkMismatch || !account) return null
    return new Contract(bptAddress, Erc20Abi, provider.getSigner(account))
  }, [account, bptAddress, networkMismatch, provider])

  const wethContract = useMemo(() => {
    if (!provider || networkMismatch || !account) return null
    return new Contract(wethAddress, Erc20Abi, provider.getSigner(account))
  }, [account, networkMismatch, provider])

  const wncgContract = useMemo(() => {
    if (!provider || networkMismatch || !account) return null
    return new Contract(wncgAddress, Erc20Abi, provider.getSigner(account))
  }, [account, networkMismatch, provider])

  return {
    bptContract,
    wethContract,
    wncgContract,
  }
}
