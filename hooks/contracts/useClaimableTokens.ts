import { useAtomValue, useSetAtom } from 'jotai'
import type { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { useContractRead } from 'wagmi'

import {
  claimableTokensAtom,
  liquidityGaugeAddressAtom,
  stakingContractAddressAtom,
} from 'states/staking'
import { networkChainId } from 'utils/network'
import { findAbiFromLiquidityGauge } from 'utils/wagmi'

const FN = 'claimable_tokens'
const ABI = findAbiFromLiquidityGauge(FN)

export function useClaimableTokens() {
  const liquidityGaugeAddress = useAtomValue(liquidityGaugeAddressAtom)
  const stakingAddress = useAtomValue(stakingContractAddressAtom)
  const setClaimableTokens = useSetAtom(claimableTokensAtom)

  useContractRead({
    addressOrName: liquidityGaugeAddress!,
    contractInterface: ABI,
    functionName: FN,
    chainId: networkChainId,
    args: [stakingAddress],
    enabled: !!liquidityGaugeAddress,
    watch: true,
    onSuccess(data) {
      const claimableTokens = formatUnits(
        (data as unknown as BigNumber)?.toString() || 0
      )
      setClaimableTokens(claimableTokens)
    },
  })
}
