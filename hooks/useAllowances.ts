import { useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRecoilValue } from 'recoil'
import { isAddress } from 'ethers/lib/utils'

import { getAccount } from 'app/states/connection'
import { networkMismatchState } from 'app/states/network'
import { fetchAllowances } from 'contracts/erc20'
import { configService } from 'services/config'
import { usePoolService } from './usePoolService'
import { useProvider } from './useProvider'
import { useAppSelector } from './useRedux'

export function useAllowances() {
  const provider = useProvider()
  const { bptAddress, poolTokenAddresses } = usePoolService()

  const account = useAppSelector(getAccount)
  const networkMismatch = useRecoilValue(networkMismatchState)

  const addresses = [
    ...poolTokenAddresses,
    configService.bal,
    configService.weth,
    bptAddress,
  ]
  const spenders = [configService.stakingAddress, configService.vaultAddress]

  const allowances = useQuery(
    ['allowances', account, addresses],
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
