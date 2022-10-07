import { useMemo } from 'react'
import { useSetAtom } from 'jotai'
import type { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { useContractReads } from 'wagmi'

import { stakedTokenBalancesAtom } from 'states/user'
import { configService } from 'services/config'
import { networkChainId } from 'utils/network'
import { findAbiFromStaking } from 'utils/wagmi'
import { useAccount } from '../useAccount'

const FN = 'stakedTokenBalance'
const ABI = findAbiFromStaking(FN)

export function useStakedBalances() {
  const { account } = useAccount()
  const setStakedBalances = useSetAtom(stakedTokenBalancesAtom)

  const contracts = useMemo(
    () =>
      configService.stakingContractAddresses.map((address) => ({
        addressOrName: address,
        contractInterface: ABI,
        functionName: FN,
        chainId: networkChainId,
        args: [account],
      })),
    [account]
  )

  useContractReads({
    contracts,
    enabled: !!account,
    watch: true,
    onSuccess(data: unknown = []) {
      const _stakedBalances = data as BigNumber[]
      const stakedBalances = _stakedBalances.map((amount) =>
        formatUnits(amount?.toString() || '0')
      )
      setStakedBalances(stakedBalances)
    },
  })
}
