import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { Contract } from 'ethers'

import { accountState } from 'app/states/connection'
import { networkMismatchState } from 'app/states/error'
import { stakingContractAddressState } from 'app/states/settings'
import { StakingAbi } from 'lib/abi'
import { useProvider } from './useProvider'

export function useStakingContract(signer?: boolean) {
  const provider = useProvider()

  const account = useRecoilValue(accountState)
  const networkMismatch = useRecoilValue(networkMismatchState)
  const stakingAddress = useRecoilValue(stakingContractAddressState)

  const contract = useMemo(() => {
    if (!provider || networkMismatch) return null
    if (signer && !account) return null

    const signerOrProvider = signer ? provider.getSigner(account!) : provider

    return new Contract(stakingAddress, StakingAbi, signerOrProvider)
  }, [provider, networkMismatch, signer, account, stakingAddress])

  return {
    contract,
    stakingAddress,
  }
}
