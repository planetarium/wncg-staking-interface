import { useCallback } from 'react'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import { StakingEthereumAbi } from 'config/abi'
import { useAuth, useChain, useSwitchNetwork } from 'hooks'

export function useCooldown() {
  const { account } = useAuth()
  const { chainId, stakingAddress } = useChain()
  const { switchBeforeSend } = useSwitchNetwork()

  const { config: writeConfig } = usePrepareContractWrite({
    address: stakingAddress,
    abi: StakingEthereumAbi,
    chainId,
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
