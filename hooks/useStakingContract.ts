import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { Contract } from 'ethers'
import { useAccount, useNetwork } from 'wagmi'

import { legacyModeState } from 'app/states/settings'
import { configService } from 'services/config'
import { StakingAbi } from 'lib/abi'
import { networkChainId } from 'utils/network'
import { useProvider } from './useProvider'

export function useStakingContract(signer?: boolean) {
  const { address: account } = useAccount()
  const { chain } = useNetwork()
  const provider = useProvider()

  const legacyMode = useRecoilValue(legacyModeState)
  const networkMismatch = chain && chain.id !== networkChainId

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
      legacyMode
        ? configService.legacyStakingAddress
        : configService.stakingAddress,
    [legacyMode]
  )

  return {
    contract,
    legacyContract,
    newContract,
    stakingAddress,
  }
}
