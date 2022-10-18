import { useAtomValue, useSetAtom } from 'jotai'
import type { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { useContractRead } from 'wagmi'

import { stakingContractAddressAtom, totalStakedAtom } from 'states/staking'
import { networkChainId } from 'utils/network'
import { findAbiFromStaking } from 'utils/wagmi'

const FN = 'totalStaked'
const ABI = findAbiFromStaking(FN)

export function useTotalStaked() {
  const stakingAddress = useAtomValue(stakingContractAddressAtom)
  const setTotalStaked = useSetAtom(totalStakedAtom)

  useContractRead({
    address: stakingAddress,
    abi: ABI,
    functionName: FN,
    chainId: networkChainId,
    watch: true,
    suspense: true,
    onSuccess(data) {
      const totalStaked = formatUnits(
        (data as unknown as BigNumber)?.toString() || 0
      )
      setTotalStaked(totalStaked)
    },
  })
}
