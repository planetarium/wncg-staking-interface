import { useCallback } from 'react'

import { earmarkRewards as initEarmarkRewards } from 'contracts/staking'
import { useStakingContract } from './useStakingContract'
import { useTx } from './useTx'

export function useEarmark() {
  const { contract } = useStakingContract(true)
  const { subscribeTx } = useTx()

  const earmarkRewards = useCallback(async () => {
    if (!contract) return
    const response = await initEarmarkRewards(contract)
    subscribeTx?.(response)
  }, [contract, subscribeTx])

  return {
    earmarkRewards,
  }
}
