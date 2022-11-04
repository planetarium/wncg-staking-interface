import { useMemo } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import type { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { useContractReads } from 'wagmi'

import { stakingContractAddressAtom } from 'states/staking'
import { rewardsAtom } from 'states/user'
import { createLogger } from 'utils/log'
import { networkChainId } from 'utils/network'
import { findAbiFromStaking } from 'utils/wagmi'
import { useAccount } from '../useAccount'
import { useStaking } from '../useStaking'

const FNS = ['earnedWNCG', 'earnedBAL']
const ABIS = findAbiFromStaking(...FNS)

const log = createLogger(`black`)

export function useRewards() {
  const { account } = useAccount()
  const { rewardTokenDecimals } = useStaking()

  const stakingAddress = useAtomValue(stakingContractAddressAtom)
  const setRewards = useSetAtom(rewardsAtom)

  const contracts = useMemo(
    () =>
      FNS.map((fn) => ({
        address: stakingAddress,
        abi: ABIS,
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
    onSettled() {
      log(`rewards`)
    },
    onSuccess(data: unknown = []) {
      const rewards = (data as BigNumber[]).map((amount, i) =>
        formatUnits(amount?.toString() || '0', rewardTokenDecimals[i] || 18)
      )
      setRewards(rewards)
    },
  })
}
