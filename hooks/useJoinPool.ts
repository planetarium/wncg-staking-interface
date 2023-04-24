import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { parseUnits } from 'ethers/lib/utils.js'

import config from 'config'
import { useAuth, useStaking } from 'hooks'

import { BalancerVaultAbi } from 'config/abi'
import { useJoinBuildRequest } from './useJoinBuildRequest'

export function useJoinPool(
  assets: Hash[],
  joinAmounts: string[],
  hasNativeCurrency: boolean
) {
  const { account } = useAuth()
  const { poolTokenDecimals } = useStaking()

  const request = useJoinBuildRequest({
    assets,
    amounts: joinAmounts,
  })

  const args = [config.poolId, account, account, request]

  const { config: writeConfig } = usePrepareContractWrite({
    address: config.vault,
    abi: BalancerVaultAbi,
    args,
    chainId: config.chainId,
    functionName: 'joinPool',
    overrides: hasNativeCurrency
      ? {
          value: parseUnits(joinAmounts[1], poolTokenDecimals[1]),
        }
      : undefined,
  })

  const { writeAsync } = useContractWrite(writeConfig)

  async function joinPool() {
    try {
      const res = await writeAsync?.()
      return res?.hash
    } catch (error) {
      throw error
    }
  }

  return writeAsync ? joinPool : undefined
}
