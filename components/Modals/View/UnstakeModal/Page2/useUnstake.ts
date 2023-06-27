import { useCallback } from 'react'
import { parseUnits } from 'ethers/lib/utils.js'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import { StakingEthereumAbi } from 'config/abi'
import { bnum } from 'utils/bnum'
import { useAuth, useChain, useStaking, useSwitchNetwork } from 'hooks'

export function useUnstake(unstakeAmount: string, checked: boolean) {
  const { account, isConnected } = useAuth()
  const { chainId, stakingAddress } = useChain()
  const { lpToken } = useStaking()

  const { switchBeforeSend } = useSwitchNetwork()

  const scaledUnstakeAmount = parseUnits(
    bnum(unstakeAmount).toString(),
    lpToken.decimals
  ).toString()

  const enabled =
    !!account &&
    !!isConnected &&
    bnum(unstakeAmount).gt(0) &&
    !bnum(unstakeAmount).isNaN()

  const { config } = usePrepareContractWrite({
    address: stakingAddress,
    chainId,
    abi: StakingEthereumAbi,
    args: [scaledUnstakeAmount, checked],
    functionName: 'withdraw',
    enabled,
    onError(error: any) {
      switchBeforeSend(error)
      if (error.reason === 'execution reverted: NOT_ENOUGH_BALANCE') return
    },
  })
  const { writeAsync } = useContractWrite(config)

  const unstake = useCallback(async () => {
    try {
      const res = await writeAsync?.()
      return res?.hash
    } catch (error) {
      throw error
    }
  }, [writeAsync])

  return writeAsync ? unstake : null
}
