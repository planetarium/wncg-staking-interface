import { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { Contract } from 'ethers'
import { useNetwork } from 'wagmi'

import { legacyModeAtom } from 'states/userSettings'
import { configService } from 'services/config'
import { StakingAbi } from 'lib/abi'
import { networkChainId } from 'utils/network'
import { useAccount } from './useAccount'
import { useProvider } from './useProvider'

export function useStakingContract(signer?: boolean) {
  const { account } = useAccount()
  const { chain } = useNetwork()
  const provider = useProvider()

  const legacyMode = useAtomValue(legacyModeAtom)
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

  return {
    contract,
    legacyContract,
    newContract,
  }
}
