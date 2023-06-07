import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { parseUnits } from 'ethers/lib/utils.js'

import config from 'config'
import { useAuth, useStaking, useSwitchNetwork } from 'hooks'

import { BalancerVaultAbi } from 'config/abi'
import { useJoinBuildRequest } from './useJoinBuildRequest'

export function useJoinPool(
  assets: Hash[],
  joinAmounts: string[],
  hasNativeCurrency: boolean
) {
  const { account } = useAuth()
  const { poolTokenDecimals, shouldReversePoolTokenOrderOnDisplay } =
    useStaking()
  const { switchBeforeSend } = useSwitchNetwork()

  const request = useJoinBuildRequest({
    assets,
    amounts: joinAmounts,
  })

  const args = [config.poolId, account, account, request]

  const baseTokenIndex = shouldReversePoolTokenOrderOnDisplay ? 0 : 1

  const { config: writeConfig } = usePrepareContractWrite({
    address: config.vault,
    abi: BalancerVaultAbi,
    args,
    chainId: config.chainId,
    functionName: 'joinPool',
    overrides: hasNativeCurrency
      ? {
          value: parseUnits(
            joinAmounts[baseTokenIndex],
            poolTokenDecimals[baseTokenIndex]
          ),
        }
      : undefined,
    onError: switchBeforeSend,
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
