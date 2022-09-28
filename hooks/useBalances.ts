import { useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRecoilValue } from 'recoil'
import { useAccount } from 'wagmi'

import { networkMismatchState } from 'app/states/error'
import { fetchBalances } from 'contracts/erc20'
import { REFETCH_INTERVAL } from 'constants/time'
import { configService } from 'services/config'
import { usePool } from './usePool'
import { useProvider } from './useProvider'
import { useStakingContract } from './useStakingContract'

export function useBalances() {
  const provider = useProvider()
  const { address: account } = useAccount()

  const { bptAddress, poolTokenAddresses } = usePool()
  const { stakingAddress } = useStakingContract()

  const networkMismatch = useRecoilValue(networkMismatchState)

  const addresses = [
    ...poolTokenAddresses,
    configService.bal,
    configService.weth,
    bptAddress,
  ]

  const { data: balances, refetch } = useQuery(
    ['userBalances', account, addresses, stakingAddress],
    () => fetchBalances(provider, account!, addresses),
    {
      enabled: !networkMismatch && !!account,
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
