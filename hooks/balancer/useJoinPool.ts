import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { parseUnits } from 'ethers/lib/utils.js'

import { BalancerVaultAbi } from 'config/abi'
import { useAuth, useChain, useStaking, useSwitchNetwork } from 'hooks'
import { useJoinBuildRequest } from './useJoinBuildRequest'
import { bnum } from 'utils/bnum'

export function useJoinPool(
  assets: Hash[],
  joinAmounts: string[],
  isNative: boolean
) {
  const { account, isConnected } = useAuth()
  const { chainId, dexProtocolAddress, dexPoolId, networkMismatch } = useChain()
  const { poolTokenDecimals, shouldReversePoolTokenOrderOnDisplay } =
    useStaking<'ethereum'>()
  const { switchBeforeSend } = useSwitchNetwork()

  const request = useJoinBuildRequest({
    assets,
    amounts: joinAmounts,
  })

  const args = [dexPoolId, account, account, request]

  const enabled =
    !networkMismatch &&
    !!isConnected &&
    joinAmounts.some((amt) => bnum(amt).gt(0))

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
    enabled,
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
