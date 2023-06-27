import { useCallback } from 'react'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import { StakingBscAbi, StakingEthereumAbi } from 'config/abi'
import { bnum } from 'utils/bnum'
import { isEthereum } from 'utils/isEthereum'
import { useAuth, useChain, useSwitchNetwork } from 'hooks'
import { useFetchUserData } from 'hooks/queries'

export function useCooldown() {
  const { account, isConnected } = useAuth()
  const { chainId, stakingAddress } = useChain()
  const { switchBeforeSend } = useSwitchNetwork()

  const { stakedTokenBalance = '0' } = useFetchUserData().data ?? {}

  const enabled = !!account && !!isConnected && bnum(stakedTokenBalance).gt(0)

  const { config } = usePrepareContractWrite({
    address: stakingAddress,
    abi: isEthereum(chainId) ? StakingEthereumAbi : StakingBscAbi,
    chainId,
    functionName: 'cooldown',
    enabled,
    onError: switchBeforeSend,
  })
  const { writeAsync } = useContractWrite(config)

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
