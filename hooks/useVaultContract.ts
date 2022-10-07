import { useMemo } from 'react'
import { Contract } from 'ethers'

import { configService } from 'services/config'
import { BalancerVaultAbi } from 'lib/abi'
import { networkChainId } from 'utils/network'
import { useAccount } from './useAccount'
import { useNetwork } from './useNetwork'
import { useProvider } from './useProvider'

export function useVaultContract() {
  const { account } = useAccount()
  const { chain } = useNetwork()
  const provider = useProvider()

  const networkMismatch = chain && chain.id !== networkChainId

  const vault = useMemo(() => {
    if (!provider || networkMismatch || !account) return null

    return new Contract(
      configService.vaultAddress,
      BalancerVaultAbi,
      provider.getSigner(account)
    )
  }, [account, networkMismatch, provider])

  return vault
}
