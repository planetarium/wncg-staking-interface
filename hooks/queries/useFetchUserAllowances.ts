import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from 'config/constants/queryKeys'
import { fetchUserAllowances } from 'lib/queries/fetchUserAllowances'
import { useAuth, useChain, useStaking } from 'hooks'

export function useFetchUserAllowances(options: UseFetchOptions = {}) {
  const {
    enabled: _enabled = true,
    refetchInterval,
    refetchOnWindowFocus,
    suspense = false,
  } = options

  const { account, isConnected } = useAuth()
  const { chainId, dexProtocolAddress, stakingAddress } = useChain()
  const { lpToken, poolTokenAddresses, tokens } = useStaking()

  const pairAddressList: Hash[][] = useMemo(
    () => [
      [lpToken?.address, stakingAddress],
      ...poolTokenAddresses?.map((addr) => [addr, dexProtocolAddress]),
    ],
    [dexProtocolAddress, lpToken?.address, poolTokenAddresses, stakingAddress]
  )

  const pairs = useMemo(
    () =>
      pairAddressList.map(
        ([addr, spender]) => [tokens?.[addr], spender] as AllowancePair
      ),
    [pairAddressList, tokens]
  )

  const enabled = _enabled && !!isConnected

  return useQuery<AllowanceMap>(
    [QUERY_KEYS.User.Allowances, account!, chainId, ...pairAddressList],
    () => fetchUserAllowances(chainId, account!, pairs),
    {
      enabled,
      staleTime: Infinity,
      refetchInterval,
      refetchOnWindowFocus,
      suspense,
      useErrorBoundary: false,
    }
  )
}
