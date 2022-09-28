import { useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { isAddress } from 'ethers/lib/utils'
import { useAccount, useNetwork } from 'wagmi'

import { fetchAllowances } from 'contracts/erc20'
import { configService } from 'services/config'
import { networkChainId } from 'utils/network'
import { usePool } from './usePool'
import { useProvider } from './useProvider'
import { useStakingContract } from './useStakingContract'

export function useAllowances() {
  const { address: account } = useAccount()
  const { chain } = useNetwork()
  const { bptAddress, poolTokenAddresses } = usePool()
  const provider = useProvider()
  const { stakingAddress } = useStakingContract()

  const networkMismatch = chain && chain.id !== networkChainId

  const addresses = [
    ...poolTokenAddresses,
    configService.bal,
    configService.weth,
    bptAddress,
  ]
  const spenders = [stakingAddress, configService.vaultAddress]

  const allowances = useQuery(
    ['allowances', account, addresses, spenders],
    () => fetchAllowances(provider, account!, addresses, spenders),
    {
      enabled: !networkMismatch && !!account,
      staleTime: 60 * 1_000,
      keepPreviousData: true,
      placeholderData: {},
    }
  )

  const allowancesMap = useMemo(() => allowances.data || {}, [allowances])

  const allowanceMapFor = useCallback(
    (spender = '') => {
      if (!isAddress(spender)) return {}
      return allowancesMap[spender] || {}
    },
    [allowancesMap]
  )

  const allowanceFor = useCallback(
    (tokenAddress = '', spender = '') => {
      const allowance = allowanceMapFor(spender)
      if (!isAddress(tokenAddress)) return false
      return allowance[tokenAddress] || false
    },
    [allowanceMapFor]
  )

  const poolTokenAllowances = useMemo(() => {
    const allowances = allowanceMapFor(configService.vaultAddress)
    return poolTokenAddresses.map((address) => allowances[address] || false)
  }, [allowanceMapFor, poolTokenAddresses])

  return {
    allowanceFor,
    allowanceMapFor,
    fetchAllowances: allowances.refetch,
    poolTokenAllowances,
  }
}
