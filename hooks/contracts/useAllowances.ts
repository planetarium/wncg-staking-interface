import { useMemo } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import type { BigNumber } from 'ethers'
import { useContractReads } from 'wagmi'

import { stakingContractAddressAtom } from 'states/staking'
import { allowancesAtom } from 'states/user'
import { configService } from 'services/config'
import { uniqAddress } from 'utils/address'
import { associateAllowances } from 'utils/contract'
import { networkChainId } from 'utils/network'
import { findAbiFromErc20 } from 'utils/wagmi'
import { useAccount } from '../useAccount'
import { usePool } from '../usePool'
import { useStaking } from './useStaking'

const FN = 'allowance'
const ABI = findAbiFromErc20(FN)

export function useAllowances() {
  const { account } = useAccount()
  const { poolTokenAddresses } = usePool()
  const { stakedTokenAddress } = useStaking()

  const setAllowances = useSetAtom(allowancesAtom)
  const stakingAddress = useAtomValue(stakingContractAddressAtom)

  const tokenAddresses = useMemo(
    () => uniqAddress([...poolTokenAddresses, stakedTokenAddress]),
    [poolTokenAddresses, stakedTokenAddress]
  )

  const spenders = useMemo(
    () => [stakingAddress, configService.vaultAddress],
    [stakingAddress]
  )

  const contracts = useMemo(
    () => [
      ...tokenAddresses.flatMap((address) => {
        return spenders.map((spender) => ({
          addressOrName: address,
          contractInterface: ABI,
          functionName: FN,
          chainId: networkChainId,
          args: [account, spender],
        }))
      }),
    ],
    [account, tokenAddresses, spenders]
  )

  useContractReads({
    contracts,
    enabled: !!account && !!stakedTokenAddress,
    watch: true,
    onSuccess(data: unknown = []) {
      const allowanceMap = associateAllowances(
        tokenAddresses,
        spenders,
        data as BigNumber[]
      )
      setAllowances(allowanceMap)
    },
  })
}
