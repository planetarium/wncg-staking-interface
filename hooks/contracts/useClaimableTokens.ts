import { useAtomValue } from 'jotai'
import type { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { useContractRead } from 'wagmi'

import { stakingContractAddressAtom } from 'states/staking'
import { createLogger } from 'utils/log'
import { networkChainId } from 'utils/network'
import { findAbiFromLiquidityGauge } from 'utils/wagmi'
import { useStaking } from '../useStaking'

const FN = 'claimable_tokens'
const ABI = findAbiFromLiquidityGauge(FN)

const log = createLogger(`black`)

export function useClaimableTokens() {
  const { liquidityGaugeAddress } = useStaking()
  const stakingAddress = useAtomValue(stakingContractAddressAtom)

  const { data } = useContractRead({
    address: liquidityGaugeAddress,
    abi: ABI,
    functionName: FN,
    chainId: networkChainId,
    args: [stakingAddress],
    enabled: !!liquidityGaugeAddress,
    watch: true,
    suspense: true,
    onSettled() {
      log(`claimable tokens`)
    },
  })

  const claimableTokens = formatUnits(
    (data as unknown as BigNumber)?.toString() || 0
  )

  return {
    claimableTokens,
  }
}
