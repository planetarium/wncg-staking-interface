import { useAtomValue, useSetAtom } from 'jotai'
import type { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { useContractRead } from 'wagmi'

import { stakingContractAddressAtom, totalStakedAtom } from 'states/staking'
import { createLogger } from 'utils/log'
import { networkChainId } from 'utils/network'
import { findAbiFromStaking } from 'utils/wagmi'

const FN = 'totalStaked'
const ABI = findAbiFromStaking(FN)

const log = createLogger(`black`)

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
    onSettled() {
      log(`total staked`)
    },
    onSuccess(data) {
      const totalStaked = formatUnits(
        (data as unknown as BigNumber)?.toString() || 0
      )
      setTotalStaked(totalStaked)
    },
  })
}
