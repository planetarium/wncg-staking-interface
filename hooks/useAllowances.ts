import { useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRecoilValue } from 'recoil'
import { isAddress } from 'ethers/lib/utils'

import { accountState } from 'app/states/connection'
import { networkMismatchState } from 'app/states/error'
import { fetchAllowances } from 'contracts/erc20'
import { configService } from 'services/config'
import { usePool } from './usePool'
import { useProvider } from './useProvider'
import { useStakingContract } from './useStakingContract'

export function useAllowances() {
  const provider = useProvider()
  const { bptAddress, poolTokenAddresses } = usePool()
  const { stakingAddress } = useStakingContract()

  const account = useRecoilValue(accountState)
  const networkMismatch = useRecoilValue(networkMismatchState)

  const addresses = [
    ...poolTokenAddresses,
    configService.bal,
    configService.weth,
    bptAddress,
  ]
  const spenders = [stakingAddress, configService.vaultAddress]

  const allowances = useQuery(
    ['allowances', account, addresses, spenders],
    () => fetchAllowances(provider, account, addresses, spenders),
    {
      enabled: !networkMismatch,
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
