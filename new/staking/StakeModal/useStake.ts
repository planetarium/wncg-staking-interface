import { useCallback } from 'react'
import { useAtomValue } from 'jotai'
import { parseUnits } from 'ethers/lib/utils'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import { stakingContractAddressAtom } from 'states/staking'
import { POOL_DECIMALS } from 'constants/tokens'
import { networkChainId } from 'utils/network'
import { bnum } from 'utils/num'
import { useAllowances } from 'hooks'
import { useStaking } from 'hooks/contracts'
import { findAbiFromStaking } from 'utils/wagmi'

const writeConfig = Object.freeze({
  abi: findAbiFromStaking('stake'),
  chainId: networkChainId,
  functionName: 'stake',
})

export function useStake(
  amount: string,
  { onConfirm, onError }: ContractWriteOption = {}
) {
  amount = bnum(amount).toString()
  const { allowanceFor } = useAllowances()
  const { stakedTokenAddress } = useStaking()

  const stakingAddress = useAtomValue(stakingContractAddressAtom)
  const isApproved = allowanceFor(stakedTokenAddress, stakingAddress)

  const { config } = usePrepareContractWrite({
    ...writeConfig,
    address: stakingAddress,
    args: [parseUnits(amount, POOL_DECIMALS).toString()],
    enabled: isApproved && !!amount,
  })

  const { writeAsync } = useContractWrite(config)

  const stake = useCallback(async () => {
    try {
      const response = await writeAsync?.()
      onConfirm?.(response?.hash as Hash)
    } catch (error: any) {
      onError?.(error)
      throw error
    }
  }, [onConfirm, onError, writeAsync])

  return stake
}
