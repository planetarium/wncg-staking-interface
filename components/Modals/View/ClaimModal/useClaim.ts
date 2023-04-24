import { useCallback, useMemo } from 'react'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import config from 'config'
import { StakingAbi } from 'config/abi'
import { useAuth, useRewards, useSwitchNetwork } from 'hooks'
import { parseUnits } from 'utils/parseUnits'

export function useClaim(rewardList: boolean[], earnedRewards: string[]) {
  const { account } = useAuth()
  const { switchBeforeSend } = useSwitchNetwork()
  const { rewardTokenDecimals } = useRewards()

  const functionName = useMemo(() => {
    if (rewardList.every((r) => !!r)) return 'claimAllRewards'
    if (rewardList[0]) return 'claimWNCGRewards'
    if (rewardList[1]) return 'claimBALRewards'
    return ''
  }, [rewardList])

  const args = useMemo(() => {
    if (functionName !== 'claimWNCGRewards') return []
    return [parseUnits(earnedRewards[0], rewardTokenDecimals[0]).toString()]
  }, [earnedRewards, functionName, rewardTokenDecimals])

  const { config: writeConfig } = usePrepareContractWrite({
    address: config.stakingAddress,
    abi: StakingAbi,
    chainId: config.chainId,
    functionName,
    args,
    enabled: !!account && rewardList.some((r) => !!r) && !!functionName,
    onError: switchBeforeSend,
  })
  const { writeAsync } = useContractWrite(writeConfig)

  const claim = useCallback(async () => {
    try {
      const res = await writeAsync?.()
      return res?.hash
    } catch (error) {
      throw error
    }
  }, [writeAsync])

  return writeAsync ? claim : null
}
