import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { parseUnits } from 'ethers/lib/utils.js'

import { BalancerVaultAbi } from 'config/abi'
import { useAuth, useChain, useStaking, useSwitchNetwork } from 'hooks'
import { useJoinBuildRequest } from './useJoinBuildRequest'

export function useJoinPool(
  assets: Hash[],
  joinAmounts: string[],
  isNative: boolean
) {
  const { account } = useAuth()
  const { chainId, dexProtocolAddress, dexPoolId } = useChain()
  const { poolTokenDecimals, shouldReversePoolTokenOrderOnDisplay } =
    useStaking<'ethereum'>()
  const { switchBeforeSend } = useSwitchNetwork()

  const request = useJoinBuildRequest({
    assets,
    amounts: joinAmounts,
  })

  const args = [dexPoolId, account, account, request]

  const baseTokenIndex = shouldReversePoolTokenOrderOnDisplay ? 0 : 1

  const { config: writeConfig } = usePrepareContractWrite({
    address: dexProtocolAddress,
    abi: BalancerVaultAbi,
    args,
    chainId,
    functionName: 'joinPool',
    overrides: isNative
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
