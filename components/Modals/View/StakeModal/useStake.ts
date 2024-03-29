import { useCallback, useState } from 'react'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import { StakingEthereumAbi } from 'config/abi'
import { bnum } from 'utils/bnum'
import { parseUnits } from 'utils/parseUnits'
import { useAuth, useChain, useStaking, useSwitchNetwork } from 'hooks'

export function useStake(stakeAmount: string) {
  const [error, setError] = useState<string | null>(null)

  const { isConnected } = useAuth()
  const { chainId, networkMismatch, stakingAddress } = useChain()
  const { lpToken, tokens } = useStaking()
  const { switchBeforeSend } = useSwitchNetwork()

  const scaledStakeAmount = parseUnits(
    bnum(stakeAmount).toString(),
    tokens[lpToken?.address]?.decimals ?? 18
  ).toString()

  const enabled =
    !networkMismatch &&
    !!isConnected &&
    bnum(stakeAmount).gt(0) &&
    !bnum(stakeAmount).isNaN()

  const { config: writeConfig } = usePrepareContractWrite({
    address: stakingAddress,
    abi: StakingEthereumAbi,
    chainId,
    args: [scaledStakeAmount],
    functionName: 'stake',
    enabled,
    onError(err: any) {
      switchBeforeSend(err)

      if (err?.shortMessage?.includes('BAL#407')) {
        setError('INSUFFICIENT_ALLOWANCE')
      }
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

  return {
    stake,
    error,
  }
}
