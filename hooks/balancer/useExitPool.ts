import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import config from 'config'
import { BalancerVaultAbi } from 'config/abi'
import { bnum } from 'utils/bnum'
import { useAuth, useChain, useStaking, useSwitchNetwork } from 'hooks'
import { useExitBuildRequest } from './useExitBuildRequest'

type UseExitPoolParams = {
  assets: Hash[]
  bptOutPcnt: string
  exitAmounts: string[]
  exitType: Hash | null
  isExactOut: boolean
}

export function useExitPool({
  assets,
  bptOutPcnt,
  exitType,
  exitAmounts,
  isExactOut,
}: UseExitPoolParams) {
  const { account } = useAuth()
  const { chainId } = useChain()
  const { switchBeforeSend } = useSwitchNetwork()
  const { balancerGaugeAddress } = useStaking<'ethereum'>()

  const request = useExitBuildRequest({
    assets,
    amounts: exitAmounts,
    exitType,
    isExactOut,
    bptOutPcnt,
  })

  const { config: writeConfig } = usePrepareContractWrite({
    address: balancerGaugeAddress,
    abi: BalancerVaultAbi,
    chainId,
    args: [config.poolId, account, account, request],
    functionName: 'exitPool',
    enabled: exitAmounts.some((amt) => bnum(amt).gt(0)),
    onError: switchBeforeSend,
  })

  const { writeAsync } = useContractWrite(writeConfig)

  async function exitPool() {
    try {
      const res = await writeAsync?.()
      return res?.hash
    } catch (error) {
      throw error
    }
  }

  return writeAsync ? exitPool : undefined
}