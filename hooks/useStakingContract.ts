import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { Contract } from 'ethers'

import { getAccount } from 'app/states/connection'
import { networkMismatchState } from 'app/states/network'
import { configService } from 'services/config'
import { StakingAbi } from 'lib/abi'
import { useAppSelector } from './useRedux'
import { useProvider } from './useProvider'

export function useStakingContract(signer?: boolean) {
  const provider = useProvider()
  const networkMismatch = useRecoilValue(networkMismatchState)

  const account = useAppSelector(getAccount)

  const contract = useMemo(() => {
    if (!provider || networkMismatch) return null
    if (signer && !account) return null

    const signerOrProvider = signer ? provider.getSigner(account!) : provider

    return new Contract(
      configService.stakingAddress,
      StakingAbi,
      signerOrProvider
    )
  }, [account, signer, networkMismatch, provider])

  return contract
}
