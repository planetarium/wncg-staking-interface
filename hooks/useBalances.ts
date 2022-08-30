import { useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRecoilValue } from 'recoil'

import { getAccount } from 'app/states/connection'
import { networkMismatchState } from 'app/states/network'
import { fetchBalances } from 'contracts/erc20'
import { configService } from 'services/config'
import { REFETCH_INTERVAL } from 'constants/time'
import { useAppSelector } from './useRedux'
import { usePool } from './usePool'
import { useProvider } from './useProvider'

export function useBalances() {
  const provider = useProvider()
  const account = useAppSelector(getAccount) || ''

  const { bptAddress, poolTokenAddresses } = usePool()

  const networkMismatch = useRecoilValue(networkMismatchState)

  const addresses = [
    ...poolTokenAddresses,
    configService.bal,
    configService.weth,
    bptAddress,
  ]

  const { data: balances, refetch } = useQuery(
    ['userBalances', account, addresses],
    () => fetchBalances(provider, account, addresses),
    {
      enabled: !networkMismatch,
      refetchInterval: REFETCH_INTERVAL,
      keepPreviousData: true,
      placeholderData: {},
    }
  )

  const balanceMap = useMemo(() => balances || {}, [balances])

  const balanceFor = useCallback(
    (address?: string) => {
      return balanceMap[address?.toLowerCase() || ''] || '0'
    },
    [balanceMap]
  )

  const bptBalance = useMemo(
    () => balanceFor(bptAddress),
    [balanceFor, bptAddress]
  )

  return {
    balanceFor,
    bptBalance,
    fetchBalances: refetch,
  }
}
