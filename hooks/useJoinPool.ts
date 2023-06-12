import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { parseUnits } from 'ethers/lib/utils.js'

import config from 'config'

import { BalancerVaultAbi } from 'config/abi'
import {
  useAuth,
  useChain,
  useJoinBuildRequest,
  useStaking,
  useSwitchNetwork,
} from 'hooks'

export function useJoinPool(
  assets: Hash[],
  joinAmounts: string[],
  hasNativeCurrency: boolean
) {
  const { account } = useAuth()
  const { chainId } = useChain()
  const {
    balancerGaugeAddress,
    poolTokenDecimals,
    shouldReversePoolTokenOrderOnDisplay,
  } = useStaking<'ethereum'>()
  const { switchBeforeSend } = useSwitchNetwork()

  const request = useJoinBuildRequest({
    assets,
    amounts: joinAmounts,
  })

  const args = [config.poolId, account, account, request]

  const baseTokenIndex = shouldReversePoolTokenOrderOnDisplay ? 0 : 1

  // FIXME: network에 따라 달라짐
  const { config: writeConfig } = usePrepareContractWrite({
    address: balancerGaugeAddress,
    abi: BalancerVaultAbi,
    args,
    chainId,
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
