import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { Contract } from 'ethers'

import { accountState } from 'app/states/connection'
import { networkMismatchState } from 'app/states/error'
import { configService } from 'services/config'
import { StakingAbi } from 'lib/abi'
import { useProvider } from './useProvider'

export function useStakingContract(signer?: boolean) {
  const provider = useProvider()
  const networkMismatch = useRecoilValue(networkMismatchState)

  const account = useRecoilValue(accountState)

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
