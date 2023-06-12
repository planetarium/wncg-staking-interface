import { useCallback, useMemo } from 'react'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import { StakingEthereumAbi } from 'config/abi'
import { isEthereum } from 'utils/isEthereum'
import { parseUnits } from 'utils/parseUnits'
import { useAuth, useChain, useStaking, useSwitchNetwork } from 'hooks'

export function useClaim(rewardList: boolean[], earnedTokenRewards: string[]) {
  const { account } = useAuth()
  const { chainId, stakingAddress } = useChain()
  const { switchBeforeSend } = useSwitchNetwork()
  const { rewardTokenAddresses, tokens } = useStaking()

  const functionName = useMemo(() => {
    switch (true) {
      case !isEthereum(chainId):
      case rewardList.every((r) => !!r):
        return 'claimAllRewards'
      case rewardList[0]:
        return 'claimWNCGRewards'
      case rewardList[1]:
        return 'claimBALRewards'
    }
    if (rewardList.every((r) => !!r)) return 'claimAllRewards'
    if (rewardList[0]) return 'claimWNCGRewards'
    if (rewardList[1]) return 'claimBALRewards'
    return ''
  }, [chainId, rewardList])

  const args = useMemo(() => {
    if (functionName !== 'claimWNCGRewards') return []

    return [
      parseUnits(
        earnedTokenRewards[0],
        tokens[rewardTokenAddresses[0]]?.decimals ?? 18
      ).toString(),
    ]
  }, [earnedTokenRewards, functionName, rewardTokenAddresses, tokens])

  const { config: writeConfig } = usePrepareContractWrite({
    address: stakingAddress,
    abi: StakingEthereumAbi,
    chainId,
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
