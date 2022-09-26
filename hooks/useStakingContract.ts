import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { Contract } from 'ethers'

import { accountState } from 'app/states/connection'
import { networkMismatchState } from 'app/states/error'
import { legacyModeState } from 'app/states/settings'
import { configService } from 'services/config'
import { StakingAbi } from 'lib/abi'
import { useProvider } from './useProvider'

export function useStakingContract(signer?: boolean) {
  const provider = useProvider()

  const account = useRecoilValue(accountState)
  const legacyMode = useRecoilValue(legacyModeState)
  const networkMismatch = useRecoilValue(networkMismatchState)

  const newContract = useMemo(() => {
    if (!provider || networkMismatch) return null
    if (signer && !account) return null

    const signerOrProvider = signer ? provider.getSigner(account!) : provider

    return new Contract(
      configService.stakingAddress,
      StakingAbi,
      signerOrProvider
    )
  }, [provider, networkMismatch, signer, account])

  const legacyContract = useMemo(() => {
    if (!provider || networkMismatch) return null
    if (signer && !account) return null

    const signerOrProvider = signer ? provider.getSigner(account!) : provider

    return new Contract(
      configService.legacyStakingAddress,
      StakingAbi,
      signerOrProvider
    )
  }, [provider, networkMismatch, signer, account])

  const contract = useMemo(
    () => (legacyMode ? legacyContract : newContract),
    [legacyContract, legacyMode, newContract]
  )

  const stakingAddress = useMemo(
    () =>
      legacyContract
        ? configService.legacyStakingAddress
        : configService.stakingAddress,
    [legacyContract]
  )

  return {
    contract,
    legacyContract,
    newContract,
    stakingAddress,
  }
}
