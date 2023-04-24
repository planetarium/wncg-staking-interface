import { useCallback } from 'react'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import { useAuth, useSwitchNetwork } from 'hooks'
import config from 'config'
import { StakingAbi } from 'config/abi'

export function useCooldown() {
  const { account } = useAuth()
  const { switchBeforeSend } = useSwitchNetwork()

  const { config: writeConfig } = usePrepareContractWrite({
    address: config.stakingAddress,
    abi: StakingAbi,
    chainId: config.chainId,
    functionName: 'cooldown',
    enabled: !!account,
    onError: switchBeforeSend,
  })
  const { writeAsync } = useContractWrite(writeConfig)

  const cooldown = useCallback(async () => {
    try {
      const res = await writeAsync?.()
      return res?.hash
    } catch (error) {
      throw error
    }
  }, [writeAsync])

  return writeAsync ? cooldown : null
}
