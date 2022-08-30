import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { Contract } from 'ethers'
import type { Web3Provider, JsonRpcSigner } from '@ethersproject/providers'

import { getAccount } from 'app/states/connection'
import { networkMismatchState } from 'app/states/network'
import { configService } from 'services/config'
import { StakingAbi } from 'lib/abi'
import { useProvider } from './useProvider'
import { useAppSelector } from './useRedux'

export function useStakingContract(signer = false) {
  const provider = useProvider()

  const networkMismatch = useRecoilValue(networkMismatchState)
  const account = useAppSelector(getAccount)

  const contract = useMemo(() => {
    if (!provider || networkMismatch) {
      return null
    }

    let signerOrProvider: Web3Provider | JsonRpcSigner = provider

    if (signer && account) {
      signerOrProvider = provider.getSigner(account)
    }

    return new Contract(
      configService.stakingAddress,
      StakingAbi,
      signerOrProvider
    )
  }, [account, networkMismatch, provider, signer])

  return contract
}
