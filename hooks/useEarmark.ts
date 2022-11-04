import { useCallback } from 'react'

export function useEarmark() {
  // const { contract } = useStakingContract(true)

  const earmarkRewards = useCallback(async () => {
    // if (!contract) return
    // const response = await initEarmarkRewards(contract)
    // subscribeTx?.(response)
    // FIXME: Harvest
    console.log('hi')
  }, [])

  return {
    earmarkRewards,
  }
}
