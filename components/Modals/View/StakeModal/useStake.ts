import { useCallback } from 'react'
import { parseUnits } from 'ethers/lib/utils'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import config from 'config'
import { StakingAbi } from 'config/abi'
import { bnum } from 'utils/bnum'
import { useAllowances, useStaking } from 'hooks'

export function useStake(stakeAmount: string) {
  const { stakedTokenAddress, tokenMap } = useStaking()
  const allowanceFor = useAllowances()

  const isApproved = bnum(
    allowanceFor(stakedTokenAddress, config.stakingAddress)
  ).gt(stakeAmount)

  const scaledStakeAmount = parseUnits(
    bnum(stakeAmount).toString(),
    tokenMap[stakedTokenAddress]?.decimals ?? 18
  ).toString()

  const enabled = bnum(stakeAmount).gt(0) && !bnum(stakeAmount).isNaN()

  const { config: writeConfig } = usePrepareContractWrite({
    address: config.stakingAddress,
    abi: StakingAbi,
    args: [scaledStakeAmount],
    functionName: 'stake',
    enabled,
    onError(err) {
      console.log('stake error', err)
    },
  })

  const { writeAsync } = useContractWrite(writeConfig)

  const stake = useCallback(async () => {
    try {
      const res = await writeAsync?.()
      return res?.hash
    } catch (error) {
      throw error
    }
  }, [writeAsync])

  return writeAsync ? stake : null
}
