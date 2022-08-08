import { useMemo } from 'react'
import { Contract } from 'ethers'

import { getAccount } from 'app/states/connection'
import { balancerVaultAbi } from 'lib/abis'
import { useProvider } from './useProvider'
import { useAppSelector } from './useRedux'

export function useVault() {
  const account = useAppSelector(getAccount)
  const provider = useProvider()

  const vault = useMemo(() => {
    if (!provider || !account) return null

    return new Contract(
      process.env.NEXT_PUBLIC_BALANCER_VAULT_ADDRESS as string,
      balancerVaultAbi,
      provider.getSigner(account)
    )
  }, [account, provider])

  return vault
}
