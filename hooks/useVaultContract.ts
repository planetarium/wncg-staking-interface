import { useMemo } from 'react'
import { Contract } from 'ethers'

import { getAccount } from 'app/states/connection'
import { BalancerVaultAbi } from 'lib/abi'
import { useProvider } from './useProvider'
import { useAppSelector } from './useRedux'

export function useVaultContract() {
  const account = useAppSelector(getAccount)
  const provider = useProvider()

  const vault = useMemo(() => {
    if (!provider || !account) return null

    return new Contract(
      process.env.NEXT_PUBLIC_BALANCER_VAULT_ADDRESS as string,
      BalancerVaultAbi,
      provider.getSigner(account)
    )
  }, [account, provider])

  return vault
}
