import { useMemo } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import type { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { useAccount, useContractReads } from 'wagmi'

import {
  rewardTokenDecimalsAtom,
  stakingContractAddressAtom,
} from 'states/staking'
import { rewardsAtom } from 'states/user'
import { networkChainId } from 'utils/network'
import { findAbiFromStaking } from 'utils/wagmi'

const FNS = ['earnedWNCG', 'earnedBAL']
const ABIS = findAbiFromStaking(...FNS)

export function useRewards() {
  const { address: account } = useAccount()

  const stakingAddress = useAtomValue(stakingContractAddressAtom)
  const rewardTokenDecimals = useAtomValue(rewardTokenDecimalsAtom)
  const setRewards = useSetAtom(rewardsAtom)

  const contracts = useMemo(
    () =>
      FNS.map((fn) => ({
        addressOrName: stakingAddress,
        contractInterface: ABIS,
        functionName: fn,
        chainId: networkChainId,
        args: [account],
      })),
    [account, stakingAddress]
  )

  useContractReads({
    contracts,
    enabled: !!account,
    watch: true,
    onSuccess(data: unknown = []) {
      const rewards = (data as BigNumber[]).map((amount, i) =>
        formatUnits(amount?.toString() || '0', rewardTokenDecimals[i] || 18)
      )
      setRewards(rewards)
    },
  })
}
