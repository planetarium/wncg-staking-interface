import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { Contract } from 'ethers'
import { useAccount } from 'wagmi'

import { networkMismatchState } from 'app/states/error'
import { configService } from 'services/config'
import { BalancerVaultAbi } from 'lib/abi'
import { useProvider } from './useProvider'

export function useVaultContract() {
  const provider = useProvider()

  const networkMismatch = useRecoilValue(networkMismatchState)
  const { address: account } = useAccount()

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
