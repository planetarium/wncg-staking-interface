import { useMemo } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import type { BigNumber } from 'ethers'
import { useAccount, useContractReads } from 'wagmi'

import {
  stakedTokenAddressAtom,
  stakingContractAddressAtom,
} from 'states/staking'
import { allowancesAtom } from 'states/user'
import { configService } from 'services/config'
import { uniqAddress } from 'utils/address'
import { associateAllowances } from 'utils/contract'
import { networkChainId } from 'utils/network'
import { findAbiFromErc20 } from 'utils/wagmi'
import { usePool } from '../usePool'

const FN = 'allowance'
const ABI = findAbiFromErc20(FN)

export function useAllowances() {
  const { address: account } = useAccount()
  const { poolTokenAddresses } = usePool()

  const setAllowances = useSetAtom(allowancesAtom)
  const stakingAddress = useAtomValue(stakingContractAddressAtom)
  const stakedTokenAddress = useAtomValue(stakedTokenAddressAtom)

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
