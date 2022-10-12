import { useMemo } from 'react'
import { useSetAtom } from 'jotai'
import type { BigNumber } from 'ethers'
import { useAccount, useContractReads } from 'wagmi'

import { balancesAtom } from 'states/user'
import { configService } from 'services/config'
import { uniqAddress } from 'utils/address'
import { associateBalances } from 'utils/contract'
import { networkChainId } from 'utils/network'
import { findAbiFromErc20 } from 'utils/wagmi'
import { usePool } from '../usePool'
import { useStaking } from './useStaking'

const FN = 'balanceOf'
const ABI = findAbiFromErc20(FN)

export function useBalances() {
  const { address: account } = useAccount()
  const { poolTokenAddresses } = usePool()
  const { rewardTokenAddress, stakedTokenAddress } = useStaking()

  const setBalances = useSetAtom(balancesAtom)

  const addresses = useMemo(
    () =>
      uniqAddress([
        ...poolTokenAddresses,
        rewardTokenAddress,
        configService.bal,
        stakedTokenAddress,
      ]),
    [poolTokenAddresses, rewardTokenAddress, stakedTokenAddress]
  )

  const contracts = useMemo(
    () =>
      addresses.map((address) => ({
        addressOrName: address,
        contractInterface: ABI,
        functionName: FN,
        chainId: networkChainId,
        args: [account],
      })),
    [account, addresses]
  )

  useContractReads({
    contracts,
    enabled: !!account,
    watch: true,
    onSuccess(data: unknown = []) {
      const balanceMap = associateBalances(data as BigNumber[], addresses)
      setBalances(balanceMap)
    },
  })
}
