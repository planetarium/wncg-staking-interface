import { useCallback } from 'react'
import { parseUnits } from 'ethers/lib/utils.js'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import config from 'config'
import { StakingAbi } from 'config/abi'
import { bnum } from 'utils/bnum'
import { safeBigNumber } from 'utils/safeBigNumber'
import { useAuth, useStaking, useSwitchNetwork } from 'hooks'

export function useUnstake(unstakeAmount: string, checked: boolean) {
  const { account } = useAuth()
  const { stakedTokenAddress, tokenMap } = useStaking()

  const { switchBeforeSend } = useSwitchNetwork()

  const stakedToken = tokenMap[stakedTokenAddress]

  const scaledUnstakeAmount = safeBigNumber(
    parseUnits(bnum(unstakeAmount).toString(), stakedToken.decimals).toString()
  ).toString()

  console.log(333, scaledUnstakeAmount)

  const enabled =
    !!account && bnum(unstakeAmount).gt(0) && !bnum(unstakeAmount).isNaN()

  const { config: writeConfig } = usePrepareContractWrite({
    address: config.stakingAddress,
    chainId: config.chainId,
    abi: StakingAbi,
    args: [scaledUnstakeAmount, checked],
    functionName: 'withdraw',
    enabled,
    onError(error: any) {
      switchBeforeSend(error)
      if (error.reason === 'execution reverted: NOT_ENOUGH_BALANCE') return
    },
  })
  const { writeAsync } = useContractWrite(writeConfig)

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
